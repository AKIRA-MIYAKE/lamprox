import { Processor } from '../../processor'
import { LambdaProxyHandlerBuilder, ProcessorOptions } from '../../types'

export const prepareHandlerBuilder: <T, U, E>(preparedOptions?: ProcessorOptions<T, U, E>) => LambdaProxyHandlerBuilder<T, U, E>
= <T, U, E>(preparedOptions: ProcessorOptions<T, U, E> = {}) => {
  return (params: LambdaProxyHandlerBuilder.Params<T, U, E>) => {
    const processor = new Processor<T, U, E>(params.main, params.environments, Object.assign({}, preparedOptions, params.options))
    return processor.toHandler()
  }
}
