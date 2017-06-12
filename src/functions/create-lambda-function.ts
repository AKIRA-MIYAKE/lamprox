import {
  LambdaFunction,
  MainProcess,
  ProcessorOptions,
  ProcessorSettings
} from '../interface'
import { prepareLambdaFunctionBuilder } from './prepare-lambda-function-builder'

export const createLambdaFunction: <T, U, E>(
  main: MainProcess<T, U, E>,
  environments: E,
  options?: ProcessorOptions<T, U, E>,
  settings?: ProcessorSettings
) => LambdaFunction
= <T, U, E>(
  main: MainProcess<T, U, E>,
  environments: E,
  options: ProcessorOptions<T, U, E> = {},
  settings: ProcessorSettings
) => {
  const builder = prepareLambdaFunctionBuilder<T, U, E>(options, settings)
  return builder(main, environments)
}