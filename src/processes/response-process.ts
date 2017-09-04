import { ProxyResult } from 'aws-lambda'

import { ResponseProcess } from '../types'

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
