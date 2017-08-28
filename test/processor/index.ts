import * as assert from 'power-assert'
import { invokeHandler, generateMockCallback } from 'lambda-utilities'

import { Processor } from '../../src/processor'
import { generateDummyAPIGatewayEvent } from '../../src/utilities'

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

    it('Should get handler.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        ambience => {
          const result: MainProcessResult = {
            fizz: ambience.environments.foo,
            buzz: ambience.environments.bar * 2
          }
          return Promise.resolve(result)
        },
        { foo: 'env', bar: 21 }
      )
      const handler = processor.toHandler()

      const callback = generateMockCallback((error, result) => {
        callback.once()
        assert.equal(result.statusCode, 200)
        assert.equal(result.body, JSON.stringify({ fizz: 'env', buzz: 42 }))
        assert.ok(callback.verify())
        done()
      })
      
      invokeHandler(handler, {
        event: generateDummyAPIGatewayEvent(),
        callback: callback
      })
    })

    it('Should get async handler.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        ambience => new Promise((resolve, reject) => {
          const result: MainProcessResult = {
            fizz: ambience.environments.foo,
            buzz: ambience.environments.bar * 2
          }
          setTimeout(() => {
            resolve(result)
          }, 1000)
        }),
        { foo: 'env', bar: 21 }
      )
      const handler = processor.toHandler()

      const callback = generateMockCallback((error, result) => {
        callback.once()
        assert.equal(result.statusCode, 200)
        assert.equal(result.body, JSON.stringify({ fizz: 'env', buzz: 42 }))
        assert.ok(callback.verify())
        done()
      })
      
      invokeHandler(handler, {
        event: generateDummyAPIGatewayEvent(),
        callback: callback
      })
    })

    it('Should get handler with before process.', done => {
      const processor = new Processor<string, MainProcessResult, Enviroments>(
        ambience => {
          const result: MainProcessResult = {
            fizz: `${ambience.result}:${ambience.environments.foo}`,
            buzz: ambience.environments.bar * 2
          }
          return Promise.resolve(result)
        },
        { foo: 'env', bar: 21 },
        {
          before: ambience => Promise.resolve('before')
        }
      )

      const handler = processor.toHandler()
      
      const callback = generateMockCallback((error, result) => {
        callback.once()
        assert.equal(result.statusCode, 200)
        assert.equal(result.body, JSON.stringify({ fizz: 'before:env', buzz: 42 }))
        assert.ok(callback.verify())
        done()
      })
      
      invokeHandler(handler, {
        event: generateDummyAPIGatewayEvent(),
        callback: callback
      })
    }),

    it('Should get handler with after prosess.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        ambience => {
          const result: MainProcessResult = {
            fizz: ambience.environments.foo,
            buzz: ambience.environments.bar * 2
          }
          return Promise.resolve(result)
        },
        { foo: 'env', bar: 21 },
        {
          after: ambience => {
            const result: MainProcessResult = {
              fizz: `after:${ambience.result.fizz}`,
              buzz: ambience.result.buzz
            }
            return Promise.resolve(result)
          }
        }
      )
      
      const handler = processor.toHandler()
      
      const callback = generateMockCallback((error, result) => {
        callback.once()
        assert.equal(result.statusCode, 200)
        assert.equal(result.body, JSON.stringify({ fizz: 'after:env', buzz: 42 }))
        assert.ok(callback.verify())
        done()
      })
      
      invokeHandler(handler, {
        event: generateDummyAPIGatewayEvent(),
        callback: callback
      })
    })

    it('Should get handler that invoke onErrorProcess when error occured.', done => {
      const processor = new Processor<undefined, MainProcessResult, Enviroments>(
        ambience => {
          return Promise.reject(new Error('Error occured.'))
        },
        { foo: 'env', bar: 21 }
      )
      const handler = processor.toHandler()

      const callback = generateMockCallback((error, result) => {
        callback.once()
        assert.equal(result.statusCode, 500)
        assert.equal(JSON.parse(result.body).message, 'Error occured.')
        assert.ok(callback.verify())
        done()
      })
      
      invokeHandler(handler, {
        event: generateDummyAPIGatewayEvent(),
        callback: callback
      })
    })

  })

})
