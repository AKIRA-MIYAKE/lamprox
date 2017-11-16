import { generateDummyAPIGatewayEvent } from '../../../src/utilities/api-gateway-event'


describe('utilities/api-gateway-event', () => {

  describe('generateDummyAPIGatewayEvent()', () => {

    describe('when called.', () => {

      it('return dummy event.', () => {
        const event = generateDummyAPIGatewayEvent()

        expect(event).toEqual({
          resource: '/resource',
          path: '/path/to/resource',
          httpMethod: 'GET',
          requestContext: {
            "path": "/path/to/resource",
            "resourcePath": "/resource",
            "httpMethod": "GET",
          },
          isBase64Encoded: false
        })
      })

    })

    describe('when passed options.', () => {

      it('return dummy event that overrided on passed options.', () => {
        const event = generateDummyAPIGatewayEvent({
          resource: '/override',
          path: '/path/override',
          httpMethod: 'POST',
          headers: { 'Content-Type': 'text/html' }
        })

        expect(event).toEqual({
          resource: '/override',
          path: '/path/override',
          httpMethod: 'POST',
          headers: { 'Content-Type': 'text/html' },
          requestContext: {
            "path": "/path/to/resource",
            "resourcePath": "/resource",
            "httpMethod": "GET",
          },
          isBase64Encoded: false
        })
      })

    })

  })

})
