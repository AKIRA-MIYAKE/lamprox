"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultResponseProcess = function () { return function (ambience) {
    var result = ambience.result;
    var headers = {};
    var body = '';
    if (typeof result !== 'undefined') {
        if (typeof result === 'string') {
            headers['Content-Type'] = 'text/plain';
            body = result;
        }
        else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(result);
        }
    }
    return Promise.resolve({
        statusCode: 200,
        headers: headers,
        body: body
    });
}; };
