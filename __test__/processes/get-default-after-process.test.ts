import { generateMockContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../src/utilities/api-gateway-event'
import { generateProcessAmbience } from '../../src/utilities/process-ambience'

import { getDefaultAfterProcess } from '../../src/processes'


describe('processes', () => {

  describe('getDefaultAfterProcess()', () => {

    describe('returned process.', () => {

      it('resolve with result when invoked.', async () => {
        const process = getDefaultAfterProcess<{ foo: number }, void>()

        const ambience = generateProcessAmbience<{ foo: number }, void>({
          result: { foo: 42 },
          environments: undefined,
          event: generateDummyAPIGatewayEvent(),
          context: generateMockContext(),
          callback: generateMockCallback()
        })

        const result = await process(ambience)
        expect(result).toEqual({ foo: 42 })
      })

    })

  })

})
