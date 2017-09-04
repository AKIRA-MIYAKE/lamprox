"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createHttpError = require("http-errors");
var http_errors_1 = require("../utilities/http-errors");
exports.getDefaultOnErrorProcess = function () { return function (ambience) {
    var result = ambience.result;
    var error = (typeof result !== 'undefined') ? result : new createHttpError.InternalServerError();
    return Promise.resolve({
        statusCode: (http_errors_1.isHttpError(error)) ? error.statusCode : 500,
        body: JSON.stringify({ name: error.name, message: error.message })
    });
}; };
