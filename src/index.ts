import { Future, future, IFuturePromiseLike } from 'monapt';
import { Context, Callback } from 'aws-lambda';

export interface LambdaFunction {
  (event: LambdaEvent, context: LambdaContext, callback: LambdaCallback): void
}

export type LambdaEvent = any;

export type LambdaContext = Context;

export interface LambdaCallback {
  (error: null, result: LambdaCallbackResult): void;
}

export interface LambdaCallbackResult {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

export interface Process<T, U, E> {
  (value: ProcessAmbience<T, E>, promise: IFuturePromiseLike<U>): void;
}

export interface ProcessAmbience<T, E> {
  lambda: ProcessAmbienceLambda;
  result: T;
  environments: E;
}

export interface ProcessAmbienceLambda {
  event: LambdaEvent;
  context: LambdaContext;
  callback: LambdaCallback;
}

export interface ProcessorInterface<T, U, E> {
  before: BeforeProcess<T, E>;
  main: MainProcess<T, U, E>;
  onSuccess: OnSuccessProcess<U, E>;
  onFailure: OnFailureProcess<E>;
  after: AfterProcess<E>;

  lambda: () => LambdaFunction;
}

export type BeforeProcess<T, E> = Process<null, T, E>;
export type MainProcess<T, U, E> = Process<T, U, E>;
export type OnSuccessProcess<U, E> = Process<U, LambdaCallbackResult, E>;
export type OnFailureProcess<E> = Process<Error, LambdaCallbackResult, E>;
export type AfterProcess<E> = Process<LambdaCallbackResult, LambdaCallbackResult, E>

export interface ProcessorOptions<T, U, E> {
  before?: BeforeProcess<T, E>;
  onSuccess?: OnSuccessProcess<U, E>;
  onFailure?: OnFailureProcess<E>;
  after?: AfterProcess<E>;
}

export class Processor<T, U, E> implements ProcessorInterface<T, U, E> {

  before: BeforeProcess<T, E> = (ambience, promise) => {
    promise.success(null);
  };

  onSuccess: OnSuccessProcess<U, E> = (ambience, promise) => {
    let body: string;
    if (typeof ambience.result === 'string') {
      body = ambience.result;
    } else {
      body = JSON.stringify(ambience.result);
    }

    promise.success({
      statusCode: 200,
      headers: {},
      body: body
    });
  };

  onFailure: OnFailureProcess<E> = (ambience, promise) => {
    promise.success({
      statusCode: 500,
      headers: {},
      body: ambience.result.message
    });
  };

  after: AfterProcess<E> = (ambience, promise) => {
    promise.success(ambience.result);
  };

  constructor(public main: MainProcess<T, U, E>, options: ProcessorOptions<T, U, E> = {}, public environments: E = undefined) {

    if ('before' in options) {
      this.before = options.before;
    }

    if ('onSuccess' in options) {
      this.onSuccess = options.onSuccess;
    }

    if ('onFailure' in options) {
      this.onFailure = options.onFailure;
    }

    if ('after' in options) {
      this.after = options.after;
    }
  }

  lambda(): LambdaFunction {
    return (event, context, callback) => {
      future<ProcessAmbience<LambdaCallbackResult, E>>(promise => {
        Future.succeed<ProcessAmbience<null, E>>({ lambda: { event, context, callback }, result: undefined, environments: this.environments })
        .flatMap(ambience => _wrapProcess(ambience, this.before))
        .flatMap(ambience => _wrapProcess(ambience, this.main))
        .onComplete(trier => trier.match({
          Success: ambience => {
            _wrapProcess(ambience, this.onSuccess)
            .onComplete(trier => trier.match({
              Success: ambience => promise.success(ambience),
              Failure: error => promise.failure(error)
            }));
          },
          Failure: error => {
            _wrapProcess({ lambda: { event, context, callback }, result: error, environments: this.environments }, this.onFailure)
            .onComplete(trier => trier.match({
              Success: ambience => promise.success(ambience),
              Failure: error => promise.failure(error)
            }));
          }
        }));
      })
      .flatMap(ambience => _wrapProcess(ambience, this.after))
      .onComplete(trier => trier.match({
        Success: ambience => { ambience.lambda.callback(null, ambience.result) },
        Failure: error => _fatalErrorHandler(error, callback)
      }));
    };
  }

}

const _wrapProcess= <T, U, E>(ambience: ProcessAmbience<T, E>, process: Process<T, U, E>): Future<ProcessAmbience<U, E>> => {
  return future<U>(promise => process(ambience, promise))
  .map<ProcessAmbience<U, E>>(result => ({ lambda: ambience.lambda, result: result, environments: ambience.environments }));
};

const _fatalErrorHandler = (error: Error, callback: LambdaCallback) => {
  callback(null, {
    statusCode: 500,
    headers: {},
    body: JSON.stringify({
      error: 'Fatal Error',
      originalError: error
    })
  });
};

export const prepareLambdaFunction = <T, U, E>(options: ProcessorOptions<T, U, E> = {}, environments: E = undefined): (main: MainProcess<T, U, E>) => LambdaFunction => {
  return main => new Processor<T, U, E>(main, options, environments).lambda();
};

export const createLambdaFunction = <T, U, E>(main: MainProcess<T, U, E>, options: ProcessorOptions<T, U, E> = {}, environments: E = undefined): LambdaFunction => {
  return prepareLambdaFunction(options, environments)(main);
};

export const lamprox = <T>(main: MainProcess<null, T, null>): LambdaFunction  => {
  return createLambdaFunction<null, T, null>(main);
};
