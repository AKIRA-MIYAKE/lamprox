import { Future } from 'monapt'

import {
  LambdaProxyEvent,
  Process,
  ProcessAmbience
} from '../interface'
import { processToFuture } from './process-to-future'

export interface InvokeProcessParams<T, E> {
  event: LambdaProxyEvent
  result: T
  environments: E
}

export const invokeProcess: <T, U, E>(
  process: Process<T, U, E>,
  params: InvokeProcessParams<T, E>
) => Future<ProcessAmbience<U, E>>
= <T, U, E>(
  process: Process<T, U, E>,
  params: InvokeProcessParams<T, E>
) => {
  const ambience: ProcessAmbience<T, E> = {
    lambda: {
      event: params.event,
      context: undefined!,
      callback: undefined!,
    },
    result: params.result,
    environments: params.environments
  }

  return processToFuture<T, U, E>(ambience, process)
}
