import { ProxyHandler, APIGatewayEvent } from 'aws-lambda'

export const buildCORSOptionsHandler: (options?: BuildCORSOptionsHandler.Options) => ProxyHandler
= (options = {}) => (event, context, callback) => {
  const headers: { [key: string]: any } = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT,DELETE,CONNECT,TRACE,PATCH'
  }

  if (typeof options.allowOrigin !== 'undefined') {
    if (typeof options.allowOrigin === 'string') {
      headers['Access-Control-Allow-Origin'] = options.allowOrigin
    } else if (typeof options.allowOrigin === 'function') {
      headers['Access-Control-Allow-Origin'] = options.allowOrigin(event)
    }
  }

  if (typeof options.allowCredentials !== 'undefined') {
    headers['Access-Control-Allow-Credentials'] = options.allowCredentials
  }

  if (typeof options.allowMethods !== 'undefined') {
    headers['Access-Control-Allow-Methods'] = options.allowMethods.join(',')
  }

  if (typeof options.allowHeaders !== 'undefined') {
    headers['Access-Control-Allow-Headers'] = options.allowHeaders.join(',')
  }

  if (typeof options.exposeHeaders !== 'undefined') {
    headers['Access-Control-Expose-Headers'] = options.exposeHeaders.join(',')
  }

  if (typeof options.maxAge !== 'undefined') {
    headers['Access-Control-Max-Age'] = options.maxAge
  }

  callback!(undefined, {
    statusCode: 200,
    headers: headers,
    body: ''
  })
}

export namespace BuildCORSOptionsHandler {
  export interface Options {
    allowOrigin?: string | ((event?: APIGatewayEvent) => string)
    allowCredentials?: boolean
    allowMethods?: string[]
    allowHeaders?: string[]
    exposeHeaders?: string[]
    maxAge?: number
  }
}
