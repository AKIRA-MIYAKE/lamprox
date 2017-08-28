"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultBeforeProcess = function () { return function (ambience) { return Promise.resolve(undefined); }; };
exports.getDefaultAfterProcess = function () { return function (ambience) { return Promise.resolve(ambience.result); }; };
exports.getDefaultResponseProcess = function () { return function (ambience) {
    var result = ambience.result;
    var body = (typeof result !== 'undefined')
        ? (typeof result !== 'string') ? JSON.stringify(result) : result
        : '';
    return Promise.resolve({
        statusCode: 200,
        body: body
    });
}; };
exports.getDefaultOnErrorProcess = function () { return function (ambience) {
    var result = ambience.result;
    var body = (typeof result !== 'undefined')
        ? JSON.stringify({ name: result.name, message: result.message })
        : JSON.stringify({ name: 'FatalError', message: 'An error occurred.' });
    return Promise.resolve({
        statusCode: 500,
        body: body
    });
}; };
