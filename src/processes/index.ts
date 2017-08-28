import {
  BeforeProcess,
  AfterProcess,
  ResponseProcess,
  OnErrorProcess,
  ProcessAmbience
} from '../types'

export const getDefaultBeforeProcess: <T, E>() => BeforeProcess<T, E>
= <T, E>() => ambience => Promise.resolve(undefined)

export const getDefaultAfterProcess: <U, E>() => AfterProcess<U, E>
= <U, E>() => ambience => Promise.resolve(ambience.result)

export const getDefaultResponseProcess: <U, E>() => ResponseProcess<U, E>
= <U, E>() => ambience => {
  const result = ambience.result

  const body = (typeof result !== 'undefined')
    ? (typeof result !== 'string') ? JSON.stringify(result) : result
    : ''

  return Promise.resolve({
    statusCode: 200,
    body: body
  })
}

export const getDefaultOnErrorProcess: <E>() => OnErrorProcess<E>
= <E>() => ambience => {
  const result = ambience.result

  const body = (typeof result !== 'undefined')
    ? JSON.stringify({ name: result.name, message: result.message })
    : JSON.stringify({ name: 'FatalError', message: 'An error occurred.' })

  return Promise.resolve({
    statusCode: 500,
    body: body
  })
}
