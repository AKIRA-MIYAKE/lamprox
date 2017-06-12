import {
  LambdaFunction,
  LambdaFunctionBuilder,
  MainProcess,
  ProcessorOptions,
  ProcessorSettings
} from '../interface'
import { Processor } from '../processor'

export const prepareLambdaFunctionBuilder: <T, U, E>(
  options?: ProcessorOptions<T, U, E>,
  settings?: ProcessorSettings
) => LambdaFunctionBuilder<T, U, E>
= <T, U, E>(
  options: ProcessorOptions<T, U, E> = {},
  settings: ProcessorSettings = {}
): LambdaFunctionBuilder<T, U, E> => {
  const preparedOptions = options
  return (
    main: MainProcess<T, U, E>,
    environments: E,
    options: ProcessorOptions<T, U, E> = {}
  ) => {
    const _options = Object.assign({}, preparedOptions, options)
    const processor = new Processor<T, U, E>(main, environments, _options, settings)
    return processor.getLambdaFunction()
  }
}
