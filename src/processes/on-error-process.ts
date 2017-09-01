import * as createHttpError from 'http-errors'

import { isHttpError } from '../utilities/http-errors'

import { OnErrorProcess } from '../types'

export const getDefaultOnErrorProcess: <E>() => OnErrorProcess<E>
= <E>() => ambience => {
  const result = ambience.result
  const error = (typeof result !== 'undefined') ? result : new createHttpError.InternalServerError()

  return Promise.resolve({
    statusCode: (isHttpError(error)) ? error.statusCode : 500,
    body: JSON.stringify({ name: error.name, message: error.message })
  })
}
