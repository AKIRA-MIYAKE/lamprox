import { Future, future, IFuturePromiseLike } from 'monapt';
import { Context, Callback } from 'aws-lambda';

export type ILambdaFunction = (event: ILambdaEvent, context: ILambdaContext, callback: ILambdaCallback) => void

export type ILambdaEvent = any;

export type ILambdaContext = Context;

export type ILambdaCallback = (error: null, result: ILambdaCallbackResult) => void;

export interface ILambdaCallbackResult {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}


export type IProcess<T, U> = (value: IProcessAmbience<T>, promise: IFuturePromiseLike<U>) => void;

export interface IProcessAmbience<T> {
  lambda: IProcessAmbienceLambda;
  result: T;
}

export interface IProcessAmbienceLambda {
  event: ILambdaEvent;
  context: ILambdaContext;
  callback: ILambdaCallback;
}


export interface IProcessor<T, U> {
  before: IBeforeProcess<T>;
  main: IMainProcess<T, U>;
  onSuccess: IOnSuccessProcess<U>;
  onFailure: IOnFailureProcess;
  after: IAfterProcess;

  lambda: () => ILambdaFunction;
}

export type IBeforeProcess<T> = IProcess<null, T>;
export type IMainProcess<T, U> = IProcess<T, U>;
export type IOnSuccessProcess<T> = IProcess<T, ILambdaCallbackResult>;
export type IOnFailureProcess = IProcess<Error, ILambdaCallbackResult>;
export type IAfterProcess = IProcess<ILambdaCallbackResult, ILambdaCallbackResult>

export interface IProcessorOptions<T, U> {
  before?: IBeforeProcess<T>;
  onSuccess?: IOnSuccessProcess<U>;
  onFailure?: IOnFailureProcess;
  after?: IAfterProcess;
}

export class Processor<T, U> implements IProcessor<T, U> {

  main: IMainProcess<T, U>;

  before: IBeforeProcess<T> = (ambience, promise) => {
    promise.success(null);
  };

  onSuccess: IOnSuccessProcess<U> = (ambience, promise) => {
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

  onFailure: IOnFailureProcess = (ambience, promise) => {
    promise.success({
      statusCode: 500,
      headers: {},
      body: ambience.result.message
    });
  };

  after: IAfterProcess = (ambience, promise) => {
    promise.success(ambience.result);
  };

  constructor(main: IMainProcess<T, U>, options: IProcessorOptions<T, U> = {}) {
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

  lambda(): ILambdaFunction {
    return (event, context, callback) => {
      future<IProcessAmbience<ILambdaCallbackResult>>(promise => {
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

function _wrapProcess<T, U>(ambience: IProcessAmbience<T>, process: IProcess<T, U>): Future<IProcessAmbience<U>> {
  return Future.succeed(ambience)
  .map(process)
  .map((result, promise) => {
    promise.success({
      lambda: ambience.lambda,
      result: result
    });
  });
}

function _fatalErrorHandler(error: Error, callback: ILambdaCallback) {
  callback(null, {
    statusCode: 500,
    headers: {},
    body: JSON.stringify({
      error: 'Fatal Error',
      originalError: error
    })
  });
}

export function prepareLambdaFunction<T, U>(options: IProcessorOptions<T, U> = {}): (main: IMainProcess<T, U>) => ILambdaFunction {
  return main => new Processor<T, U>(main, options).lambda();
}

export function createLambdaFunction<T, U>(main: IMainProcess<T, U>, options: IProcessorOptions<T, U> = {}) {
  return prepareLambdaFunction(options)(main);
}

export const lamprox = (main: IMainProcess<null, string>): ILambdaFunction  => {
  return createLambdaFunction<null, string>(main);
}
