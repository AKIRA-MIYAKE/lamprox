import { APIGatewayEvent, Context, ProxyCallback, ProxyResult } from 'aws-lambda'
import { Handler } from 'lambda-utilities'

export interface LambdaProxyHandlerBuilder<T, U, E> {
  (params: LambdaProxyHandlerBuilder.Params<T, U, E>): LambdaProxyHandler
}

export namespace LambdaProxyHandlerBuilder {
  export interface Params<T, U, E> {
    main: MainProcess<T, U, E>
    environments: E
    options?: ProcessorOptions<T, U, E>
  }
}

export interface LambdaProxyHandler extends Handler<APIGatewayEvent, ProxyCallback> { }

/** Processing one unit. */
export interface Process<T, U, E> {
  (ambience: ProcessAmbience<T, E>): Promise<U | undefined>
}

/** Preparing before main process. */
export type BeforeProcess<T, E> = Process<undefined, T, E>
/** Main process for request. */
export type MainProcess<T, U, E> = Process<T, U, E>
/** After process. */
export type AfterProcess<U, E> = Process<U, U, E>
/** Process that creating proxy result. */
export type ResponseProcess<U, E> = Process<U, ProxyResult, E>
/** Process that called when error occured. */
export type OnErrorProcess<E> = Process<Error, ProxyResult, E>


export interface ProcessAmbience<T, E> {
  /** Variables that pssed lambda function. */
  lambda: {
    event: APIGatewayEvent
    context: Context
    callback: ProxyCallback
  }
  /** Result that preceding process. */
  result?: T
  /** Shared variables accross that processes. */
  environments: E
}

export interface IProcessor<T, U, E> {
  before: BeforeProcess<T, E>
  main: MainProcess<T, U, E>
  after: AfterProcess<U, E>
  response: ResponseProcess<U, E>
  onError: OnErrorProcess<E>

  toHandler: () => LambdaProxyHandler
}

export interface ProcessorOptions<T, U, E> {
  before?: BeforeProcess<T, E>
  after?: AfterProcess<U, E>
  response?: ResponseProcess<U, E>
  onError?: OnErrorProcess<E>
}
