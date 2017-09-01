import { HttpError } from 'http-errors'

export function isHttpError(error: Error): error is HttpError {
  const _error = error as any

  if (
    typeof _error.statusCode !== 'undefined' &&
    typeof _error.expose !== 'undefined'
  ) {
    return true
  } else {
    return false
  }
}
