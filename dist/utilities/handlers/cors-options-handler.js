"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCORSOptionsHandler = function (options) {
    if (options === void 0) { options = {}; }
    return function (event, context, callback) {
        var headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT,DELETE,CONNECT,TRACE,PATCH'
        };
        if (typeof options.allowOrigin !== 'undefined') {
            if (typeof options.allowOrigin === 'string') {
                headers['Access-Control-Allow-Origin'] = options.allowOrigin;
            }
            else if (typeof options.allowOrigin === 'function') {
                headers['Access-Control-Allow-Origin'] = options.allowOrigin(event);
            }
        }
        if (typeof options.allowCredentials !== 'undefined') {
            headers['Access-Control-Allow-Credentials'] = options.allowCredentials;
        }
        if (typeof options.allowMethods !== 'undefined') {
            headers['Access-Control-Allow-Methods'] = options.allowMethods.join(',');
        }
        if (typeof options.allowHeaders !== 'undefined') {
            headers['Access-Control-Allow-Headers'] = options.allowHeaders.join(',');
        }
        if (typeof options.exposeHeaders !== 'undefined') {
            headers['Access-Control-Expose-Headers'] = options.exposeHeaders.join(',');
        }
        if (typeof options.maxAge !== 'undefined') {
            headers['Access-Control-Max-Age'] = options.maxAge;
        }
        callback(undefined, {
            statusCode: 200,
            headers: headers,
            body: ''
        });
    };
};
