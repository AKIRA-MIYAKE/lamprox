import { Future, future } from 'monapt'

import { Process, ProcessAmbience } from '../interface'

export const processToFuture: <T, U, E>(ambience: ProcessAmbience<T, E>, process: Process<T, U, E>) => Future<ProcessAmbience<U, E>>
= <T, U, E>(ambience: ProcessAmbience<T, E>, process: Process<T, U, E>) => future<U>(promise => process(ambience, promise))
.map<ProcessAmbience<U, E>>(result => ({
  lambda: ambience.lambda,
  result: result,
  environments: ambience.environments
}))

