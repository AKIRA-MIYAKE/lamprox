import * as assert from 'power-assert'

import { generateDummyContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../src/utilities/api-gateway-event'
import { generateProcessAmbience } from '../../src/utilities/process-ambience'

import { getDefaultResponseProcess } from '../../src/processes'

describe('processes', () => {

  describe('getDefaultResponseProcess', () => {

    it('Should return proxy result when input result is string.', () => {
      const process = getDefaultResponseProcess<string, undefined>()
      const ambience = generateProcessAmbience<string, undefined>({
        event: generateDummyAPIGatewayEvent(),
        context: generateDummyContext(),
        callback: generateMockCallback(),
        result: 'This is a result string.',
        environments: undefined
      })

      return process(ambience)
      .then(result => {
        assert.equal(result.statusCode, 200)
        assert.equal(result.headers['Content-Type'], 'text/plain')
        assert.equal(result.body, 'This is a result string.')
      })
    })

    it('Should return proxy result when input result is object.', () => {
      interface Result {
        foo: number,
        bar: string
      }

      const process = getDefaultResponseProcess<Result, undefined>()
      const ambience = generateProcessAmbience<Result, undefined>({
        event: generateDummyAPIGatewayEvent(),
        context: generateDummyContext(),
        callback: generateMockCallback(),
        result: { foo: 42, bar: 'banana' },
        environments: undefined
      })

      return process(ambience)
      .then(result => {
        assert.equal(result.statusCode, 200)
        assert.equal(result.headers['Content-Type'], 'application/json')
        const body = JSON.parse(result.body)
        assert.equal(body.foo, 42)
        assert.equal(body.bar, 'banana')
      })
    })

    it('Should return proxy result when input result is undefined.', () => {
      interface Result {
        foo: number,
        bar: string
      }

      const process = getDefaultResponseProcess<Result, undefined>()
      const ambience = generateProcessAmbience<Result, undefined>({
        event: generateDummyAPIGatewayEvent(),
        context: generateDummyContext(),
        callback: generateMockCallback(),
        result: undefined,
        environments: undefined
      })

      return process(ambience)
      .then(result => {
        assert.equal(result.statusCode, 200)
        assert.equal(result.body, '')
      })
    })

  })

})
