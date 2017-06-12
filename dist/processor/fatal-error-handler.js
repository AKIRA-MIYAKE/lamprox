"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fatalErrorHandler = function (error, callback) {
    var body = {
        name: error.name,
        message: error.message
    };
    callback(undefined, {
        statusCode: 500, body: JSON.stringify(body)
    });
};
