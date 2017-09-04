import * as assert from 'power-assert'

import * as createHttpError from 'http-errors'

import { isHttpError } from '../../../src/utilities/http-errors'

describe('utilities/http-error', () => {

  describe('isHttpError()', () => {

    it('Should be able to discriminate.', () => {
      assert.ok(isHttpError(new createHttpError.BadRequest()))
      assert.ok(isHttpError(new createHttpError.Unauthorized()))
      assert.ok(isHttpError(new createHttpError.Forbidden()))
      assert.ok(isHttpError(new createHttpError.NotFound()))
      assert.ok(isHttpError(new createHttpError.InternalServerError()))
      assert.ok(!isHttpError(new Error()))
    })

  })

})
