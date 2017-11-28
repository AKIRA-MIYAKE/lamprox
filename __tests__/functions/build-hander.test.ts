import { generateMockContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../src/utilities/api-gateway-event'
import { buildHandler } from '../../src/functions'
import { getDefaultAfterProcess, getDefaultResponseProcess, getDefaultOnErrorProcess } from '../../src/processes'


describe('functions', () => {

  describe('buildHandler()', () => {

    describe('when passed minimal params.', () => {

      it('return lambda proxy handler.', async () => {
        const handler = buildHandler<void, { foo: number }, { ratio: number }>({
          main: ambience => {
            return Promise.resolve({ foo: 21 * ambience.environments.ratio })
          },
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

    describe('when passed full parmas.', () => {

      it('return lambda proxy handler.', async () => {
        const handler = buildHandler<number, { foo: number }, { ratio: number }>({
          main: ambience => {
            return Promise.resolve({ foo: ambience.result * ambience.environments.ratio })
          },
          environments: { ratio: 2 },
          before: ambience => Promise.resolve(21),
          after: ambience => {
            expect(ambience.result).toEqual({ foo: 42 })
            return Promise.resolve(ambience.result)
          },
          response: ambience => {
            return getDefaultResponseProcess<{ foo: number }, { ratio: number }>()(ambience)
            .then(result => {
              expect(result.statusCode).toBe(200)
              return result
            })
          },
          onError: getDefaultOnErrorProcess()
        })

        const event = generateDummyAPIGatewayEvent()
        const context = generateMockContext()
        const callback = generateMockCallback((error, result) => {
          expect(result.body).toBe(JSON.stringify({ foo: 42 }))
        })

        await handler(event, context, callback)
      })

    })

  })

})
