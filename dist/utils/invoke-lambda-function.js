"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monapt_1 = require("monapt");
exports.invokeLambdaFunction = function (lambdaFunction, params) {
    return monapt_1.future(function (promise) {
        lambdaFunction(params.event, undefined, function (undefined, result) {
            promise.success(result);
        });
    });
};
