"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLambdaProxyEvent = function (params) {
    if (params === void 0) { params = {}; }
    var _event = {
        resource: '/resource',
        path: '/path/to/resource',
        httpMethod: 'GET',
        requestContext: {
            "path": "/path/to/resource",
            "resourcePath": "/resource",
            "httpMethod": "GET",
        },
        isBase64Encoded: false
    };
    return Object.assign({}, _event, params);
};
