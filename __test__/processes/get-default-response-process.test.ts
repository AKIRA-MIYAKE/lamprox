import { generateMockContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../src/utilities/api-gateway-event'
import { generateProcessAmbience } from '../../src/utilities/process-ambience'

import { getDefaultResponseProcess } from '../../src/processes'


describe('processes', () => {

  describe('getDefaultAfterProcess()', () => {

    describe('returned process.', () => {

      it('resolve with result when invoked with undefined result.', async () => {
        const process = getDefaultResponseProcess<void, void>()

        const ambience = generateProcessAmbience<void, void>({
          result: undefined,
          environments: undefined,
          event: generateDummyAPIGatewayEvent(),
          context: generateMockContext(),
          callback: generateMockCallback()
        })

        const result = await process(ambience)
        expect(result).toEqual({
          statusCode: 200,
          headers: {},
          body: ''
        })
      })

      it('resolve with result when invoked with string result,', async () => {
        const process = getDefaultResponseProcess<string, void>()

        const ambience = generateProcessAmbience<string, void>({
          result: 'string result.',
          environments: undefined,
          event: generateDummyAPIGatewayEvent(),
          context: generateMockContext(),
          callback: generateMockCallback()
        })

        const result = await process(ambience)
        expect(result).toEqual({
          statusCode: 200,
          headers: { 'Content-Type': 'text/plain' },
          body: 'string result.'
        })
      })

      it('resolve with result when invoked with object result,', async () => {
        const process = getDefaultResponseProcess<{ foo: number }, void>()

        const ambience = generateProcessAmbience<{ foo: number }, void>({
          result: { foo: 42 },
          environments: undefined,
          event: generateDummyAPIGatewayEvent(),
          context: generateMockContext(),
          callback: generateMockCallback()
        })

        const result = await process(ambience)
        expect(result).toEqual({
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foo: 42 })
        })
      })

    })

  })

})
