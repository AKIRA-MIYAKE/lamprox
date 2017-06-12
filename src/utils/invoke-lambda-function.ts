import { Future, future } from 'monapt'

import {
  LambdaFunction,
  LambdaProxyEvent,
  LambdaProxyCallbackResult
} from '../interface'

export interface InvokeLambdaFunctionParams {
  event: LambdaProxyEvent
}

export const invokeLambdaFunction: <E>(
  lambdaFunction: LambdaFunction,
  params: InvokeLambdaFunctionParams
) => Future<LambdaProxyCallbackResult>
= <E>(
  lambdaFunction: LambdaFunction,
  params: InvokeLambdaFunctionParams
) => {
  return future(promise => {
    lambdaFunction(params.event, undefined!, (undefined, result) => {
      promise.success(result)
    })
  })
}
