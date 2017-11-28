import * as createHttpError from 'http-errors'
import { generateMockContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../src/utilities/api-gateway-event'
import { generateProcessAmbience } from '../../src/utilities/process-ambience'

import { getDefaultOnErrorProcess } from '../../src/processes'


describe('processes', () => {

  describe('getDefaultOnErrorProcess()', () => {

    describe('returned process.', () => {

      it('resolve with result when invoked with HttpErrors.', async () => {
        const process = getDefaultOnErrorProcess<void>()

        const ambience = generateProcessAmbience<Error, void>({
          result: new createHttpError.BadRequest(),
          environments: undefined,
          event: generateDummyAPIGatewayEvent(),
          context: generateMockContext(),
          callback: generateMockCallback()
        })

        const result = await process(ambience)
        expect(result.statusCode).toBe(400)
      })

      it('resolve with result when invoked with Error constructor.', async () => {
        const process = getDefaultOnErrorProcess<void>()

        const ambience = generateProcessAmbience<Error, void>({
          result: new Error('error message.'),
          environments: undefined,
          event: generateDummyAPIGatewayEvent(),
          context: generateMockContext(),
          callback: generateMockCallback()
        })

        const result = await process(ambience)
        expect(result.statusCode).toBe(500)
        expect(result.body).toBe(JSON.stringify({ name: 'Error', message: 'error message.' }))
      })

      it('resolve with result when invoked undefined.', async () => {
        const process = getDefaultOnErrorProcess<void>()

        const ambience = generateProcessAmbience<Error, void>({
          result: undefined,
          environments: undefined,
          event: generateDummyAPIGatewayEvent(),
          context: generateMockContext(),
          callback: generateMockCallback()
        })

        const result = await process(ambience)
        expect(result.statusCode).toBe(500)
      })

    })

  })

})
