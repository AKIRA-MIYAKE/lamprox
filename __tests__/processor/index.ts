import { generateMockContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../src/utilities/api-gateway-event'

import { Processor } from '../../src/processor'


describe('processor', () => {

  describe('Processor', () => {

    describe('toHandler()', () => {

      it('returned handler invoked onErrorProcess when error occured.', async () => {
        const processor = new Processor<void, void, void>({
          main: ambience => Promise.reject(new Error('error message.')),
          environments: undefined
        })

        const handler = processor.toHandler()

        const event = generateDummyAPIGatewayEvent()
        const context = generateMockContext()
        const callback = generateMockCallback((error, result) => {
          expect(result.statusCode).toBe(500)
          expect(result.body).toBe('error message.')
        })

        await handler(event, context, callback)
      })

      it('returned handler fatal error handlerble.', async () => {
        const processor = new Processor<void, void, void>({
          main: ambience => Promise.resolve(),
          environments: undefined,
          response: ambience => Promise.reject(new Error())
        })

        const handler = processor.toHandler()

        const event = generateDummyAPIGatewayEvent()
        const context = generateMockContext()
        const callback = generateMockCallback((error, result) => {
          expect(result.statusCode).toBe(500)
          expect(result.body).toBe('Fatal error occured.')
        })

        await handler(event, context, callback)
      })

    })

  })

})
