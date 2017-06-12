import { IFuturePromiseLike } from 'monapt'

import {
  LambdaProxyCallbackResult,
  ProcessAmbience,
  BeforeProcess,
  OnSuccessProcess,
  OnFailureProcess,
  AfterProcess
} from '../interface'

/**
 * Default processes that pre-set to processor.
 */
export module Processes {

  export const getBeforeProcess: <T, E>() => BeforeProcess<T, E>
  = <T, E>() => (ambience: ProcessAmbience<undefined, E>, promise: IFuturePromiseLike<T | undefined>) => {
    promise.success(undefined)
  }

  export const getOnSuccessProcess: <U, E>() => OnSuccessProcess<U, E>
  = <U, E>() => (ambience: ProcessAmbience<U, E>, promise: IFuturePromiseLike<LambdaProxyCallbackResult>) => {
    const mainResult = ambience.result

    let body: string | undefined
    if (typeof mainResult !== 'undefined') {
      if (typeof mainResult === 'string') {
        body = mainResult
      } else {
        body = JSON.stringify(mainResult)
      }
    }

    const result: LambdaProxyCallbackResult = {
      statusCode: 200,
      body: body
    }

    promise.success(result)
  }

  export const getOnFailureProcess: <E>() => OnFailureProcess<E>
  = <E>() => (ambience: ProcessAmbience<Error, E>, promise: IFuturePromiseLike<LambdaProxyCallbackResult>) => {
    const error = ambience.result!

    promise.success({
      statusCode: 500,
      body: JSON.stringify({
        name: error.name,
        message: error.message
      })
    })
  }

  export const getAfterProcess: <E>() => AfterProcess<E>
  = <E>() => (ambience: ProcessAmbience<LambdaProxyCallbackResult, E>, promise: IFuturePromiseLike<LambdaProxyCallbackResult>) => {
    promise.success(ambience.result!)
  }

}
