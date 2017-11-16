import { generateMockContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../src/utilities/api-gateway-event'
import { prepareHandlerBuilder } from '../../src/functions'
import { EINVAL } from 'constants';


describe('functions', () => {

  describe('prepareHandlerBuilder()', () => {

    describe('when invoke with none parmas.', () => {

      it('return build handler function.', async () => {
        const buildHandler = prepareHandlerBuilder<void, { foo: number}, void>()
        expect(buildHandler).toBeInstanceOf(Function)

        const handler = buildHandler({
          main: ambience => Promise.resolve({ foo: 42 }),
          environments: undefined
        })

        const event = generateDummyAPIGatewayEvent()
        const context = generateMockContext()
        const callback = generateMockCallback((error, result) => {
          expect(result.statusCode).toBe(200)
          expect(result.body).toBe(JSON.stringify({ foo: 42 }))
        })

        await handler(event, context, callback)
      })

    })

    describe('when invoke with params.', () => {

      it('return build handler function.', async () => {
        const buildHandler = prepareHandlerBuilder<number, { foo: number }, { ratio: number }>({
          before: ambience => Promise.resolve(21)
        })
        const handler = buildHandler({
          main: ambience => Promise.resolve({ foo: ambience.result * ambience.environments.ratio }),
          environments: { ratio: 2 }
        })

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
