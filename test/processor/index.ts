import * as assert from 'power-assert'

import { Processor } from '../../src/processor'
import { invokeLambdaFunction, createLambdaProxyEvent } from '../../src/utils'

describe('processor', () => {

  interface Enviroments {
    foo: string
    bar: number
  }

  interface MainProcessResult {
    fizz: string
    buzz: number
  }

  describe('Processor', () => {

    it('Should get lambda functin.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        (ambience, promise) => {
          const result: MainProcessResult = {
            fizz: ambience.environments.foo,
            buzz: ambience.environments.bar * 2
          }
          promise.success(result)
        },
        { foo: 'env', bar: 21 }
      )
      const lambdaFunction = processor.getLambdaFunction()

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

    it('Should get lambda function with async process.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        (ambience, promise) => {
          const result: MainProcessResult = {
            fizz: ambience.environments.foo,
            buzz: ambience.environments.bar * 2
          }
          setTimeout(() => {
            promise.success(result)
          }, 1000)
        },
        { foo: 'env', bar: 21 }
      )
      const lambdaFunction = processor.getLambdaFunction()

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

    it('Should get lambda function with before process.', done => {
      const processor = new Processor<string, MainProcessResult, Enviroments>(
        (ambience, promise) => {
          const result: MainProcessResult = {
            fizz: `${ambience.result}:${ambience.environments.foo}`,
            buzz: ambience.environments.bar * 2
          }
          promise.success(result)
        },
        { foo: 'env', bar: 21 },
        {
          before: (ambience, promise) => {
            promise.success('before')
          }
        }
      )
      const lambdaFunction = processor.getLambdaFunction()

      invokeLambdaFunction(lambdaFunction, { event: createLambdaProxyEvent() })
      .onComplete(trier => trier.match({
        Success: result => {
          assert.equal(result.statusCode, 200)
          assert.equal(result.body, JSON.stringify({ fizz: 'before:env', buzz: 42 }))
          done()
        },
        Failure: error => {
          assert.fail(error)
          done()
        }
      }))
    }),

    it('Should get lambda funtion with onSuccess prosess.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        (ambience, promise) => {
          const result: MainProcessResult = {
            fizz: ambience.environments.foo,
            buzz: ambience.environments.bar * 2
          }
          ambience.environments.foo = 'updated'
          promise.success(result)
        },
        { foo: 'env', bar: 21 },
        {
          onSuccess: (ambience, promise) => {
            assert.equal(ambience.environments.foo, 'updated')

            promise.success({
              statusCode: 200,
              headers: { 'Test': 'test' },
              body: JSON.stringify(ambience.result)
            })
          }
        }
      )
      const lambdaFunction = processor.getLambdaFunction()

      invokeLambdaFunction(lambdaFunction, { event: createLambdaProxyEvent() })
      .onComplete(trier => trier.match({
        Success: result => {
          assert.equal(result.statusCode, 200)
          assert.equal(result.headers['Test'], 'test')
          assert.equal(result.body, JSON.stringify({ fizz: 'env', buzz: 42 }))
          done()
        },
        Failure: error => {
          assert.fail(error)
          done()
        }
      }))
    })

    it('Should get lambda funtion with onFailuer prosess.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        (ambience, promise) => {
          promise.failure(new Error('This is a error'))
        },
        { foo: 'env', bar: 21 },
        {
          onFailure: (ambience, promise) => {
            promise.success({
              statusCode: 500,
              body: `OnFailuer:${ambience.result.message}`
            })
          }
        }
      )
      const lambdaFunction = processor.getLambdaFunction()

      invokeLambdaFunction(lambdaFunction, { event: createLambdaProxyEvent() })
      .onComplete(trier => trier.match({
        Success: result => {
          assert.equal(result.statusCode, 500)
          assert.equal(result.body, `OnFailuer:This is a error`)
          done()
        },
        Failure: error => {
          assert.fail(error)
          done()
        }
      }))
    })

    it('Should get lambda funtion with after prosess.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        (ambience, promise) => {
          const result: MainProcessResult = {
            fizz: ambience.environments.foo,
            buzz: ambience.environments.bar * 2
          }
          promise.success(result)
        },
        { foo: 'env', bar: 21 },
        {
          after: (ambience, promise) => {
            const result = Object.assign({}, ambience.result, {
              headers: { 'Test': 'test' }
            })
            promise.success(result)
          }
        }
      )
      const lambdaFunction = processor.getLambdaFunction()

      invokeLambdaFunction(lambdaFunction, { event: createLambdaProxyEvent() })
      .onComplete(trier => trier.match({
        Success: result => {
          assert.equal(result.statusCode, 200)
          assert.equal(result.headers['Test'], 'test')
          assert.equal(result.body, JSON.stringify({ fizz: 'env', buzz: 42 }))
          done()
        },
        Failure: error => {
          assert.fail(error)
          done()
        }
      }))
    })

    it('Should get lambda function that called default onFailuer process when error occured.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        (ambience, promise) => {
          promise.failure(new Error('This is a test'))
        },
        { foo: 'env', bar: 21 }
      )
      const lambdaFunction = processor.getLambdaFunction()

      invokeLambdaFunction(lambdaFunction, { event: createLambdaProxyEvent() })
      .onComplete(trier => trier.match({
        Success: result => {
          assert.equal(result.statusCode, 500)
          assert.equal(result.body, JSON.stringify({
            name: 'Error',
            message: 'This is a test'
          }))
          done()
        },
        Failure: error => {
          assert.fail(error)
          done()
        }
      }))
    })

    it('Should get lambda function that called fatal error handler.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        (ambience, promise) => {
          const result: MainProcessResult = {
            fizz: ambience.environments.foo,
            buzz: ambience.environments.bar * 2
          }
          promise.success(result)
        },
        { foo: 'env', bar: 21 },
        {
          onSuccess: (ambience, promise) => {
            throw new Error('This is a test')
          }
        }
      )
      const lambdaFunction = processor.getLambdaFunction()

      invokeLambdaFunction(lambdaFunction, { event: createLambdaProxyEvent() })
      .onComplete(trier => trier.match({
        Success: result => {
          assert.equal(result.statusCode, 500)
          assert.equal(result.body, JSON.stringify({
            name: 'Error',
            message: 'This is a test'
          }))
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