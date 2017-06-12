import * as assert from 'power-assert'

import { LambdaProxyCallbackResult } from '../../src/interface'
import { prepareLambdaFunctionBuilder, lamprox } from '../../src/functions'
import { Processes } from '../../src/processes'
import { createLambdaProxyEvent, extendProcess, invokeLambdaFunction } from '../../src/utils'

describe('functinos', () => {

  describe('lamprox', () => {

    describe('lamprox()', () => {

      it('Should get simple lambda function.', done => {
        const lambdaFunction = lamprox<{ fizz: string }>((ambience, promise) => {
          promise.success({ fizz: 'buzz' })
        })
        invokeLambdaFunction(lambdaFunction, {
          event: createLambdaProxyEvent()
        })
        .onComplete(trier => trier.match({
          Success: result => {
            assert.equal(result.statusCode, 200)
            assert.equal(result.body, JSON.stringify({ fizz: 'buzz' }))
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

  describe('create-lambda-function-builder', () => {

    describe('createLambdaFunctionBuilder()', () => {

      it('Should update process when create lambda function.', done => {
        const lambdaFunctionBuilder = prepareLambdaFunctionBuilder<undefined, string, undefined>()
        const lambdaFunction = lambdaFunctionBuilder(
          (ambinece, promise) => {
            promise.success('result')
          },
          undefined,
          {
            onSuccess: extendProcess(Processes.getOnSuccessProcess<string, undefined>(), (ambinece, promise) => {
              const result: LambdaProxyCallbackResult = Object.assign({}, ambinece.result, {
                headers: {
                  'Test': 'test'
                }
              })
              promise.success(result)
            })
          }
        )

        invokeLambdaFunction(lambdaFunction, {
          event: createLambdaProxyEvent()
        })
        .onComplete(trier => trier.match({
          Success: result => {
            assert.equal(result.body, 'result')
            assert.equal(result.headers['Test'], 'test')
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

})
