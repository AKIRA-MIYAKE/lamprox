"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDummyAPIGatewayEvent = function (params) {
    if (params === void 0) { params = {}; }
    return Object.assign({}, {
        resource: '/resource',
        path: '/path/to/resource',
        httpMethod: 'GET',
        requestContext: {
            "path": "/path/to/resource",
            "resourcePath": "/resource",
            "httpMethod": "GET",
        },
        isBase64Encoded: false
    }, params);
};
//# sourceMappingURL=index.js.map