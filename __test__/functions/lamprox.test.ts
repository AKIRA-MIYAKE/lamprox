import { generateMockContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../src/utilities/api-gateway-event'
import { lamprox } from '../../src/functions'


describe('functions', () => {

  describe('lamprox()', () => {

    describe('when passed main process.', () => {

      it('return lambda proxy handler.', async () => {
        const handler = lamprox<{ foo: number }>(ambience => Promise.resolve({ foo: 42 }))

        const event = generateDummyAPIGatewayEvent()
        const context = generateMockContext()
        const callback = generateMockCallback((error, result) => {
          expect(result.statusCode).toBe(200)
          expect(result.body).toBe(JSON.stringify({ foo: 42 }))
        })

        await handler(event, context, callback)
      })

    })

  })

})
