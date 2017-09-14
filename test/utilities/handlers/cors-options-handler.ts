import * as assert from 'power-assert'
import { generateMockCallback, invokeHandler } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../../src/utilities'
import { buildCORSOptionsHandler } from '../../../src/utilities/handlers/cors-options-handler'

describe('utilities/handlers/cors-options-handler', () => {

  describe('buildCORSOptionsHandler()', () => {

    it('Should get simple options handler.', done => {
      const handler = buildCORSOptionsHandler()

      const event = generateDummyAPIGatewayEvent()
      const callback = generateMockCallback((error, result) => {
        assert.equal(result.statusCode, 200)
        assert.equal(result.headers['Access-Control-Allow-Origin'], '*')
        done()
      })

      invokeHandler(handler, { event, callback })
    })

    it('Should get custom options handler.', done => {
      const handler = buildCORSOptionsHandler({
        allowOrigin: 'https://example.com',
        allowCredentials: true,
        allowMethods: ['GET','POST'],
        allowHeaders: ['X-Header'],
        exposeHeaders: ['X-Header'],
        maxAge: 3000
      })

      const event = generateDummyAPIGatewayEvent()
      const callback = generateMockCallback((error, result) => {
        assert.equal(result.statusCode, 200)
        assert.equal(result.headers['Access-Control-Allow-Origin'], 'https://example.com')
        assert.equal(result.headers['Access-Control-Allow-Credentials'], true)
        assert.equal(result.headers['Access-Control-Allow-Methods'], 'GET,POST')
        assert.equal(result.headers['Access-Control-Allow-Headers'], 'X-Header')
        assert.equal(result.headers['Access-Control-Expose-Headers'], 'X-Header')
        assert.equal(result.headers['Access-Control-Max-Age'], 3000)
        done()
      })

      invokeHandler(handler, { event, callback })
    })

  })

})
