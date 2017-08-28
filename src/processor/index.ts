import { APIGatewayEvent, Context, ProxyCallback, ProxyResult } from 'aws-lambda'
import {
  getDefaultBeforeProcess,
  getDefaultAfterProcess,
  getDefaultResponseProcess,
  getDefaultOnErrorProcess
} from '../processes'
import { generateProcessAmbience } from '../utilities'
import {
  LambdaProxyHandler,
  MainProcess,
  BeforeProcess,
  AfterProcess,
  ResponseProcess,
  OnErrorProcess,
  ProcessAmbience,
  IProcessor,
  ProcessorOptions
} from '../types'

export class Processor<T, U, E> implements IProcessor<T, U, E> {

  before: BeforeProcess<T, E> = getDefaultBeforeProcess<T, E>()
  after: AfterProcess<U, E> = getDefaultAfterProcess<U, E>()
  response: ResponseProcess<U, E> = getDefaultResponseProcess<U, E>()
  onError: OnErrorProcess<E> = getDefaultOnErrorProcess<E>()

  constructor(
    public main: MainProcess<T, U, E>,
    public environments: E,
    options: ProcessorOptions<T, U, E> = {}
  ) {
    if (typeof options.before !== 'undefined') {
      this.before = options.before
    }

    if (typeof options.after !== 'undefined') {
      this.after = options.after
    }

    if (typeof options.response !== 'undefined') {
      this.response = options.response
    }

    if (typeof options.onError !== 'undefined') {
      this.onError = options.onError
    }
  }

  toHandler(): LambdaProxyHandler {
    return (event, context, callback) => {
      Promise.resolve(undefined)
      .then(result => this.before(generateProcessAmbience({ event: event, context: context, callback: callback, result: result, environments: this.environments })))
      .then(result => this.main(generateProcessAmbience({ event: event, context: context, callback: callback, result: result, environments: this.environments })))
      .then(result => this.after(generateProcessAmbience({ event: event, context: context, callback: callback, result: result, environments: this.environments })))
      .then(
        result => this.response(generateProcessAmbience({ event: event, context: context, callback: callback, result: result, environments: this.environments })),
        error => this.onError(generateProcessAmbience({ event: event, context: context, callback: callback, result: error, environments: this.environments }))
      )
      .then(result => callback(undefined, result!))
    }
  }

}

