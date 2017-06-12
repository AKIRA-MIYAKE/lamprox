"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default processes that pre-set to processor.
 */
var Processes;
(function (Processes) {
    Processes.getBeforeProcess = function () { return function (ambience, promise) {
        promise.success(undefined);
    }; };
    Processes.getOnSuccessProcess = function () { return function (ambience, promise) {
        var mainResult = ambience.result;
        var body;
        if (typeof mainResult !== 'undefined') {
            if (typeof mainResult === 'string') {
                body = mainResult;
            }
            else {
                body = JSON.stringify(mainResult);
            }
        }
        var result = {
            statusCode: 200,
            body: body
        };
        promise.success(result);
    }; };
    Processes.getOnFailureProcess = function () { return function (ambience, promise) {
        var error = ambience.result;
        promise.success({
            statusCode: 500,
            body: JSON.stringify({
                name: error.name,
                message: error.message
            })
        });
    }; };
    Processes.getAfterProcess = function () { return function (ambience, promise) {
        promise.success(ambience.result);
    }; };
})(Processes = exports.Processes || (exports.Processes = {}));
