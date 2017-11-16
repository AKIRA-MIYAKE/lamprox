import { APIGatewayEvent, Context, ProxyCallback } from 'aws-lambda'
import { ProcessAmbience } from '../../types'

export const generateProcessAmbience: <T, E>(params: GenerateProcessAmbience.Params<T, E>) => ProcessAmbience<T, E>
= <T, E>(params: GenerateProcessAmbience.Params<T, E>) => ({
  lambda: {
    event: params.event,
    context: params.context,
    callback: params.callback
  },
  result: params.result,
  environments: params.environments
})

export namespace GenerateProcessAmbience {
  export interface Params<T, E> {
    result: T,
    environments: E
    event: APIGatewayEvent,
    context: Context,
    callback: ProxyCallback
  }
}
