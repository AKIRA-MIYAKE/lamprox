import { LambdaProxyEvent } from '../interface'

export interface CreateLambdaProxyEventParams {
  resource?: string
  path?: string
  httpMethod?: string
  headers?: { [key: string]: string }
  queryStringParameters?: { [key: string]: string }
  pathParameters?: { [key: string]: string }
  stageVariables?: string | undefined
  requestContext?: { [key: string]: any }
  body?: any
  isBase64Encoded?: boolean
}

export const createLambdaProxyEvent: (params?: CreateLambdaProxyEventParams) => LambdaProxyEvent
= (params: CreateLambdaProxyEventParams = {}) => {
  const _event: LambdaProxyEvent = {
    resource: '/resource',
    path: '/path/to/resource',
    httpMethod: 'GET',
    requestContext: {
      "path": "/path/to/resource",
      "resourcePath": "/resource",
      "httpMethod": "GET",
    },
    isBase64Encoded: false
  }

  return Object.assign({}, _event, params)
}
