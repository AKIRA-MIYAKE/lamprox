import * as assert from 'power-assert'

import { Process } from '../../src/interface'
import { createLambdaFunction } from '../../src/functions'
import {
  createLambdaProxyEvent,
  invokeLambdaFunction,
  invokeProcess
} from '../../src/utils'

describe('utils', () => {

  interface Enviroments {
    foo: string
    bar: number
  }

  interface MainProcessResult {
    fizz: string
    buzz: number
  }

  describe('invoke-lambda-function', () => {

    describe('invokeLambdaFunction()', () => {

      it('Should invoke lambda function.', done => {
        const lambdaFunction = createLambdaFunction<undefined, MainProcessResult, Enviroments>((ambience, promise) => {
          const result: MainProcessResult = {
            fizz: ambience.environments.foo,
            buzz: ambience.environments.bar * 2
          }
          promise.success(result)
        }, { foo: 'env', bar: 21})

        invokeLambdaFunction(lambdaFunction, { event: createLambdaProxyEvent() })
        .onComplete(trier => trier.match({
          Success: result => {
            assert.equal(result.statusCode, 200)
            assert.equal(result.body, JSON.stringify({ fizz: 'env', buzz: 42 }))
            done()
          },
          Failure: error => {
            assert.fail(error)
            done()
          }
        }))
      })

    })

  })

  describe('invoke-process', () => {

    describe('invokeProcess()', () => {

      it('Should invoke process when success.', done => {
        const process: Process<string, MainProcessResult, Enviroments> = (ambience, promise) => {
          const result: MainProcessResult = {
            fizz: `${ambience.result}:${ambience.environments.foo}`,
            buzz: ambience.environments.bar * 2
          }
          promise.success(result)
        }

        invokeProcess<string, MainProcessResult, Enviroments>(process, {
          event: createLambdaProxyEvent(),
          result: 'result',
          environments: { foo: 'env', bar: 21 }
        })
        .onComplete(trier => trier.match({
          Success: ambience => {
            assert.equal(ambience.result.fizz, 'result:env')
            assert.equal(ambience.result.buzz, 42)
            done()
          },
          Failure: error => {
            assert.fail(error)
            done()
          }
        }))
      })

      it('Shoud invoke process when fail.', done => {
        const process: Process<string, MainProcessResult, Enviroments> = (ambience, promise) => {
          promise.failure(new Error('This is a error'))
        }

        invokeProcess<string, MainProcessResult, Enviroments>(process, {
          event: createLambdaProxyEvent(),
          result: 'result',
          environments: { foo: 'env', bar: 21 }
        })
        .onComplete(trier => trier.match({
          Success: _ => {
            assert.fail(_)
            done()
          },
          Failure: error => {
            assert.equal(error.name, 'Error')
            assert.equal(error.message, 'This is a error')
            done()
          }
        }))
      })

    })

  })

})