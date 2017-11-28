import { generateMockContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../src/utilities/api-gateway-event'
import { generateProcessAmbience } from '../../src/utilities/process-ambience'

import { getDefaultBeforeProcess } from '../../src/processes'


describe('processes', () => {

  describe('getDefaultBeforeProcess()', () => {

    describe('returned process.', () => {

      it('resolved when invoked.', async () => {
        const process = getDefaultBeforeProcess<void, void>()

        const ambience = generateProcessAmbience<void, void>({
          result: undefined,
          environments: undefined,
          event: generateDummyAPIGatewayEvent(),
          context: generateMockContext(),
          callback: generateMockCallback()
        })

        const result = await process(ambience)
        expect(result).toBeUndefined()
      })

    })

  })

})
