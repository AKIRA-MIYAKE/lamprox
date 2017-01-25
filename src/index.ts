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

export interface Process<T, U> {
  (value: ProcessAmbience<T>, promise: IFuturePromiseLike<U>): void;
}

export interface ProcessAmbience<T> {
  lambda: ProcessAmbienceLambda;
  result: T;
}

export interface ProcessAmbienceLambda {
  event: LambdaEvent;
  context: LambdaContext;
  callback: LambdaCallback;
}

export interface ProcessorInterface<T, U> {
  before: BeforeProcess<T>;
  main: MainProcess<T, U>;
  onSuccess: OnSuccessProcess<U>;
  onFailure: OnFailureProcess;
  after: AfterProcess;

  lambda: () => LambdaFunction;
}

export type BeforeProcess<T> = Process<null, T>;
export type MainProcess<T, U> = Process<T, U>;
export type OnSuccessProcess<T> = Process<T, LambdaCallbackResult>;
export type OnFailureProcess = Process<Error, LambdaCallbackResult>;
export type AfterProcess = Process<LambdaCallbackResult, LambdaCallbackResult>

export interface ProcessorOptions<T, U> {
  before?: BeforeProcess<T>;
  onSuccess?: OnSuccessProcess<U>;
  onFailure?: OnFailureProcess;
  after?: AfterProcess;
}

export class Processor<T, U> implements ProcessorInterface<T, U> {

  main: MainProcess<T, U>;

  before: BeforeProcess<T> = (ambience, promise) => {
    promise.success(null);
  };

  onSuccess: OnSuccessProcess<U> = (ambience, promise) => {
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

  onFailure: OnFailureProcess = (ambience, promise) => {
    promise.success({
      statusCode: 500,
      headers: {},
      body: ambience.result.message
    });
  };

  after: AfterProcess = (ambience, promise) => {
    promise.success(ambience.result);
  };

  constructor(main: MainProcess<T, U>, options: ProcessorOptions<T, U> = {}) {
    this.main = main;

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
      future<ProcessAmbience<LambdaCallbackResult>>(promise => {
        Future.succeed({ lambda: { event, context, callback }, result: null })
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
            _wrapProcess({ lambda: { event, context, callback }, result: error }, this.onFailure)
            .onComplete(trier => trier.match({
              Success: ambience => promise.success(ambience),
              Failure: error => promise.failure(error)
            }));
          }
        }))
      })
      .flatMap(ambience => _wrapProcess(ambience, this.after))
      .onComplete(trier => trier.match({
        Success: ambience => { ambience.lambda.callback(null, ambience.result) },
        Failure: error => _fatalErrorHandler(error, callback)
      }));
    };
  }

}

const _wrapProcess = <T, U>(ambience: ProcessAmbience<T>, process: Process<T, U>): Future<ProcessAmbience<U>> => {
  return future<U>(promise => process(ambience, promise))
  .map<ProcessAmbience<U>>(result => ({ lambda: ambience.lambda, result: result }));
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

export const prepareLambdaFunction = <T, U>(options: ProcessorOptions<T, U> = {}): (main: MainProcess<T, U>) => LambdaFunction => {
  return main => new Processor<T, U>(main, options).lambda();
};

export const createLambdaFunction = <T, U>(main: MainProcess<T, U>, options: ProcessorOptions<T, U> = {}): LambdaFunction => {
  return prepareLambdaFunction(options)(main);
};

export const lamprox = <T>(main: MainProcess<null, T>): LambdaFunction  => {
  return createLambdaFunction<null, T>(main);
};
