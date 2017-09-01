import { BeforeProcess } from '../types'

export const getDefaultBeforeProcess: <T, E>() => BeforeProcess<T, E>
= <T, E>() => ambience => Promise.resolve(undefined)
