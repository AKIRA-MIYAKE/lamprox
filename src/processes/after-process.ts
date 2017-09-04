import { AfterProcess } from '../types'

export const getDefaultAfterProcess: <U, E>() => AfterProcess<U, E>
= <U, E>() => ambience => Promise.resolve(ambience.result)
