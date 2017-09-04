import * as assert from 'power-assert'

import * as createHttpError from 'http-errors'
import { generateDummyContext, generateMockCallback } from 'lambda-utilities'

import { generateDummyAPIGatewayEvent } from '../../src/utilities/api-gateway-event'
import { generateProcessAmbience } from '../../src/utilities/process-ambience'

import { getDefaultOnErrorProcess } from '../../src/processes'

describe('processes', () => {

  describe('getDefaultOnErrorProcess()', () => {
    const process = getDefaultOnErrorProcess()

    it('Should return proxy result.', () => {
      const ambience = generateProcessAmbience<Error, undefined>({
        event: generateDummyAPIGatewayEvent(),
        context: generateDummyContext(),
        callback: generateMockCallback(),
        result: new Error('Error Message'),
        environments: undefined,
      })

      return process(ambience)
      .then(result => {
        assert.equal(result.statusCode, 500)
        const body = JSON.parse(result.body)
        assert.equal(body.name, 'Error')
        assert.equal(body.message, 'Error Message')
      })
    })

    it('SHoud return proxy result when bad request.', () => {
      const ambience = generateProcessAmbience<Error, undefined>({
        event: generateDummyAPIGatewayEvent(),
        context: generateDummyContext(),
        callback: generateMockCallback(),
        result: new createHttpError.BadRequest(),
        environments: undefined,
      })

      return process(ambience)
      .then(result => {
        assert.equal(result.statusCode, 400)
        const body = JSON.parse(result.body)
        assert.equal(body.name, 'BadRequestError')
        assert.equal(body.message, 'Bad Request')
      })
    })

    it('SHoud return proxy result when unauthorizedt.', () => {
      const ambience = generateProcessAmbience<Error, undefined>({
        event: generateDummyAPIGatewayEvent(),
        context: generateDummyContext(),
        callback: generateMockCallback(),
        result: new createHttpError.Unauthorized(),
        environments: undefined,
      })

      return process(ambience)
      .then(result => {
        assert.equal(result.statusCode, 401)
        const body = JSON.parse(result.body)
        assert.equal(body.name, 'UnauthorizedError')
        assert.equal(body.message, 'Unauthorized')
      })
    })

    it('SHoud return proxy result when forbidden.', () => {
      const ambience = generateProcessAmbience<Error, undefined>({
        event: generateDummyAPIGatewayEvent(),
        context: generateDummyContext(),
        callback: generateMockCallback(),
        result: new createHttpError.Forbidden(),
        environments: undefined,
      })

      return process(ambience)
      .then(result => {
        assert.equal(result.statusCode, 403)
        const body = JSON.parse(result.body)
        assert.equal(body.name, 'ForbiddenError')
        assert.equal(body.message, 'Forbidden')
      })
    })

    it('SHoud return proxy result when not found.', () => {
      const ambience = generateProcessAmbience<Error, undefined>({
        event: generateDummyAPIGatewayEvent(),
        context: generateDummyContext(),
        callback: generateMockCallback(),
        result: new createHttpError.NotFound(),
        environments: undefined,
      })

      return process(ambience)
      .then(result => {
        assert.equal(result.statusCode, 404)
        const body = JSON.parse(result.body)
        assert.equal(body.name, 'NotFoundError')
        assert.equal(body.message, 'Not Found')
      })
    })

    it('Should return proxy result internal server error.', () => {
      const ambience = generateProcessAmbience<Error, undefined>({
        event: generateDummyAPIGatewayEvent(),
        context: generateDummyContext(),
        callback: generateMockCallback(),
        result: new createHttpError.InternalServerError(),
        environments: undefined,
      })

      return process(ambience)
      .then(result => {
        assert.equal(result.statusCode, 500)
        const body = JSON.parse(result.body)
        assert.equal(body.name, 'InternalServerError')
        assert.equal(body.message, 'Internal Server Error')
      })
    })

  })

})
