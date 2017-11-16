"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createHttpError = require("http-errors");
var http_errors_1 = require("../utilities/http-errors");
exports.getDefaultBeforeProcess = function () { return function (ambience) { return Promise.resolve(ambience.result); }; };
exports.getDefaultAfterProcess = function () { return function (ambience) { return Promise.resolve(ambience.result); }; };
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
exports.getDefaultOnErrorProcess = function () { return function (ambience) {
    var result = ambience.result;
    var error = (typeof result !== 'undefined') ? result : new createHttpError.InternalServerError();
    return Promise.resolve({
        statusCode: (http_errors_1.isHttpError(error)) ? error.statusCode : 500,
        body: JSON.stringify({ name: error.name, message: error.message })
    });
}; };
//# sourceMappingURL=index.js.map