"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isHttpError(error) {
    var _error = error;
    if (typeof _error.statusCode !== 'undefined' &&
        typeof _error.expose !== 'undefined') {
        return true;
    }
    else {
        return false;
    }
}
exports.isHttpError = isHttpError;
