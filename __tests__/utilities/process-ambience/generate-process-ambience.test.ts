import { generateMockContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../../src/utilities/api-gateway-event'
import { generateProcessAmbience } from '../../../src/utilities/process-ambience'


describe('utilities/process-ambience', () => {

  describe('generateProcessAmbience()', () => {

    describe('when passed mock objects.', () => {

      it('return promise ambience', () => {
        const event = generateDummyAPIGatewayEvent()
        const context = generateMockContext()
        const callback = generateMockCallback()

        const ambience = generateProcessAmbience({
          result: 42,
          environments: { ratio: 2 },
          event: event,
          context: context,
          callback: callback
        })

        expect(ambience).toBeDefined()
        expect(ambience.result).toBe(42)
        expect(ambience.environments).toEqual({ ratio: 2 })
        expect(ambience.lambda.event).toEqual(event)
        expect(ambience.lambda.context).toEqual(context)
        expect(ambience.lambda.callback).toEqual(callback)
      })

    })

  })

})
