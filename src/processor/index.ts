import {
  LambdaProxyHandler,
  IProcessor,
  BeforeProcess,
  MainProcess,
  AfterProcess,
  ResponseProcess,
  OnErrorProcess
} from '../types'
import { getDefaultBeforeProcess, getDefaultAfterProcess, getDefaultResponseProcess, getDefaultOnErrorProcess } from '../processes'
import { generateProcessAmbience } from '../utilities/process-ambience'
import { error } from 'util';

export class Processor<T, U, E> implements IProcessor<T, U, E> {

  main: MainProcess<T, U, E>
  enviroments: E

  before: BeforeProcess<T, E> = getDefaultBeforeProcess<T, E>()
  after: AfterProcess<U, E> = getDefaultAfterProcess<U, E>()
  response: ResponseProcess<U, E> = getDefaultResponseProcess<U, E>()
  onError: OnErrorProcess<E> = getDefaultOnErrorProcess<E>()

  constructor(params: IProcessor.Params<T, U, E>) {
    this.main = params.main
    this.enviroments = params.environments

    if (typeof params.before !== 'undefined') {
      this.before = params.before
    }

    if (typeof params.after !== 'undefined') {
      this.after = params.after
    }

    if (typeof params.response !== 'undefined') {
      this.response = params.response
    }

    if (typeof params.onError !== 'undefined') {
      this.onError = params.onError
    }
  }

  toHandler(): LambdaProxyHandler {
    const environments = this.enviroments
    return (event, context, callback) => {
      Promise.resolve()
      .then(result => this.before(generateProcessAmbience({ result, environments, event, context, callback })))
      .then(result => this.main(generateProcessAmbience({ result, environments, event, context, callback })))
      .then(result => this.after(generateProcessAmbience({ result, environments, event, context, callback })))
      .then(
        result => this.response(generateProcessAmbience({ result, environments, event, context, callback })),
        result => this.onError(generateProcessAmbience({ result, environments, event, context, callback }))
      )
      .then(result => callback(undefined, result))
      .catch(error => {
        callback(undefined, { statusCode: 500, body: 'Fatal error occured.'})
      })
    }
  }

}
