import {
  LambdaFunction,
  MainProcess,
  ProcessorOptions,
  ProcessorSettings
} from '../interface'
import { prepareLambdaFunctionBuilder } from './prepare-lambda-function-builder'

export const lamprox: <U>(main: MainProcess<undefined, U, undefined>) => LambdaFunction
= <U>(main: MainProcess<undefined, U, undefined>) => {
  const builder = prepareLambdaFunctionBuilder<undefined, U, undefined>()
  return builder(main, undefined)
}
