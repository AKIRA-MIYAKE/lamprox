import { LambdaProxyHandler, BeforeProcess, MainProcess, AfterProcess, ResponseProcess, OnErrorProcess, IProcessor  } from '../types'
import { Processor } from '../processor'

export namespace PrepareHandlerBuilder {
  export interface Params<T, U, E> {
    before?: BeforeProcess<T, E>
    after?: AfterProcess<U, E>
    response?: ResponseProcess<U, E>
    onError?: OnErrorProcess<E>
  }
}

export interface BuildHandler<T, U, E> {
  (params: IProcessor.Params<T, U, E>): LambdaProxyHandler
}

export const prepareHandlerBuilder: <T, U, E>(preparedParams?: PrepareHandlerBuilder.Params<T, U, E>) => BuildHandler<T, U, E>
= <T, U, E>(preparedParams:  PrepareHandlerBuilder.Params<T, U, E> = {}) => (params: IProcessor.Params<T, U, E>) => {
  const _params = Object.assign({}, params, preparedParams)
  const processor = new Processor<T, U, E>(_params)
  return processor.toHandler()
}

export const buildHandler: <T, U, E>(params: IProcessor.Params<T, U, E>) => LambdaProxyHandler
= <T, U, E>(params: IProcessor.Params<T, U, E>) => {
  return prepareHandlerBuilder<T, U, E>()(params)
}

export const lamprox: <U>(main: MainProcess<void, U, void>) => LambdaProxyHandler
= <U>(main: MainProcess<void, U, void>) => {
  return buildHandler<void, U, void>({ main: main, environments: undefined })
}
