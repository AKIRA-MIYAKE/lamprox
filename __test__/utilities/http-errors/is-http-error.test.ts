import * as createHttpError from 'http-errors'
import { isHttpError } from '../../../src/utilities/http-errors'


describe('utilities/http-errors', () => {

  describe('isHttpError()', () => {

    describe('when passed error object that created by createHttpError.', () => {

      it('return true.', () => {
        expect(isHttpError(new createHttpError.BadRequest())).toBe(true)
        expect(isHttpError(new createHttpError.Unauthorized())).toBe(true)
        expect(isHttpError(new createHttpError.Forbidden())).toBe(true)
        expect(isHttpError(new createHttpError.NotFound())).toBe(true)
        expect(isHttpError(new createHttpError.InternalServerError())).toBe(true)
      })

    })

    describe('when passed error object that created by Error constructor.', () => {

      it('return false.', () => {
        expect(isHttpError(new Error()))
      })

    })

  })

})
