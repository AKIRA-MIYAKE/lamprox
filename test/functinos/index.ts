import * as assert from 'power-assert'
import { invokeHandler, generateMockCallback } from 'lambda-utilities'

import { buildHandler, lamprox, prepareHandlerBuilder } from '../../src/functions'
import { generateDummyAPIGatewayEvent } from '../../src/utilities'

describe('functinos', () => {

  describe('prepare-handler-builder', () => {

    describe('prepareHandlerBuilder()', () => {

      it('Should get buildHandler function.', done => {
        const buildHandler = prepareHandlerBuilder<number, { foo: number },  { ratio: number }>({
          before: ambience => Promise.resolve(21)
        })

        const handler = buildHandler({
          main: ambience => Promise.resolve({ foo: ambience.result * ambience.environments.ratio }),
          environments: { ratio: 2 }
        })

        const callback = generateMockCallback((error, result) => {
          callback.once()
          assert.equal(result.statusCode, 200)
          assert.equal(result.body, JSON.stringify({ foo: 42 }))
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

  describe('build-hander', () => {

    describe('buildHandler()', () => {

      it('Should get handler.', done => {
        const handler = buildHandler<number, { foo: number }, { ratio: number }>({
          main: ambience => Promise.resolve({ foo: ambience.result * ambience.environments.ratio }),
          environments: { ratio: 2 },
          options: {
            before: ambience => Promise.resolve(21)
          }
        })

        const callback = generateMockCallback((error, result) => {
          callback.once()
          assert.equal(result.statusCode, 200)
          assert.equal(result.body, JSON.stringify({ foo: 42 }))
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

  describe('lamprox', () => {

    describe('lamprox()', () => {

      it('Should get simple handler.', done => {
        const handler = lamprox<{ foo: number }>(ambience => Promise.resolve({ foo: 42 }))

        const callback = generateMockCallback((error, result) => {
          callback.once()
          assert.equal(result.statusCode, 200)
          assert.equal(result.body, JSON.stringify({ foo: 42 }))
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

})
