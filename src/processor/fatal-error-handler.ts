import { FatalErrorHandler } from '../interface'

export const fatalErrorHandler: FatalErrorHandler
= (error, callback) => {
  const body = {
    name: error.name,
    message: error.message
  }

  callback(undefined, {
    statusCode: 500, body: JSON.stringify(body)
  })
}
