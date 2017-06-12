import { IFuturePromiseLike } from 'monapt'

import { Process, ProcessAmbience } from '../interface'
import { processToFuture } from './process-to-future'

export const extendProcess: <T, U, E>(parent: Process<T, U, E>, ex: Process<U, U, E>) => Process<T, U, E>
= <T, U, E>(parent: Process<T, U, E>, ex: Process<U, U, E>) => {
  return (ambience: ProcessAmbience<T, E>, promise: IFuturePromiseLike<U>) => {
    processToFuture(ambience, parent)
    .onComplete(trier => trier.match({
      Success: ambience => ex(ambience, promise),
      Failure: error => promise.failure(error)
    }))
  }
}
