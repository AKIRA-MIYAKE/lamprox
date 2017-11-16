import * as createHttpError from 'http-errors'

import { BeforeProcess, AfterProcess, ResponseProcess, OnErrorProcess } from '../types'
import { isHttpError } from '../utilities/http-errors'


export const getDefaultBeforeProcess: <T, E>() => BeforeProcess<T, E>
= <T, E>() => ambience => Promise.resolve(<any>ambience.result)

export const getDefaultAfterProcess: <U, E>() => AfterProcess<U, E>
= <U, E>() => ambience => Promise.resolve(ambience.result)

export const getDefaultResponseProcess: <U, E>() => ResponseProcess<U, E>
= <U, E>() => ambience => {
  const result = ambience.result

  let headers: { [key: string]: any } = {}
  let body: string = ''

  if (typeof result !== 'undefined') {
    if (typeof result === 'string') {
      headers['Content-Type'] = 'text/plain'
      body = result
    } else {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(result)
    }
  }

  return Promise.resolve({
    statusCode: 200,
    headers: headers,
    body: body
  })
}

export const getDefaultOnErrorProcess: <E>() => OnErrorProcess<E>
= <E>() => ambience => {
  const result = ambience.result
  const error = (typeof result !== 'undefined') ? result : new createHttpError.InternalServerError()

  return Promise.resolve({
    statusCode: (isHttpError(error)) ? error.statusCode : 500,
    body: JSON.stringify({ name: error.name, message: error.message })
  })
}
