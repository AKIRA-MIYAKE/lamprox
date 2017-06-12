import { Future, future } from 'monapt'
import {
  LambdaFunction,
  LambdaProxyCallbackResult,
  Process,
  ProcessAmbience,
  MainProcess,
  BeforeProcess,
  OnSuccessProcess,
  OnFailureProcess,
  AfterProcess,
  IProcessor,
  ProcessorOptions,
  ProcessorSettings,
  FatalErrorHandler
} from '../interface'
import { Processes } from '../processes'
import { fatalErrorHandler } from './fatal-error-handler'
import { processToFuture } from '../utils'

export class Processor<T, U, E> implements IProcessor<T, U, E> {

  before: BeforeProcess<T, E> = Processes.getBeforeProcess<T, E>()
  onSuccess: OnSuccessProcess<U, E> = Processes.getOnSuccessProcess<U, E>()
  onFailure: OnFailureProcess<E> = Processes.getOnFailureProcess<E>()
  after: AfterProcess<E> = Processes.getAfterProcess<E>()

  fatalErrorHandler: FatalErrorHandler = fatalErrorHandler

  constructor(
    public main: MainProcess<T, U, E>,
    public environments: E,
    options: ProcessorOptions<T, U, E> = {},
    settings: ProcessorSettings = {}
  ) {
    if (typeof options.before !== 'undefined') {
      this.before = options.before
    }

    if (typeof options.onSuccess !== 'undefined') {
      this.onSuccess = options.onSuccess
    }

    if (typeof options.onFailure !== 'undefined') {
      this.onFailure = options.onFailure
    }

    if (typeof options.after !== 'undefined') {
      this.after = options.after
    }

    if (typeof settings.fatalErrorHandler !== 'undefined') {
      this.fatalErrorHandler = settings.fatalErrorHandler
    }
  }

  getLambdaFunction(): LambdaFunction {
    return (event, context, callback) => {
      future<ProcessAmbience<LambdaProxyCallbackResult, E>>(promise => {
        Future.succeed<ProcessAmbience<undefined, E>>({
          lambda: { event, context, callback },
          result: undefined,
          environments: this.environments
        })
        .flatMap(ambience => processToFuture(ambience, this.before))
        .flatMap(ambience => processToFuture(ambience, this.main))
        .onComplete(trier => trier.match({
          Success: ambience => {
            processToFuture(ambience, this.onSuccess)
            .onComplete(trier => trier.match({
              Success: ambience => promise.success(ambience),
              Failure: error => promise.failure(error)
            }))
          },
          Failure: error => {
            processToFuture({
              lambda: { event, context, callback },
              result: error,
              environments: this.environments
            }, this.onFailure)
            .onComplete(trier => trier.match({
              Success: ambience => promise.success(ambience),
              Failure: error => promise.failure(error)
            }))
          }
        }))
      })
      .flatMap(ambience => processToFuture(ambience, this.after))
      .onComplete(trier => trier.match({
        Success: ambience => {
          callback(undefined, ambience.result!)
        },
        Failure: error => {
          this.fatalErrorHandler(error, callback)
        }
      }))
    }
  }

}
