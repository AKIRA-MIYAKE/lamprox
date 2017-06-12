"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prepare_lambda_function_builder_1 = require("./prepare-lambda-function-builder");
exports.lamprox = function (main) {
    var builder = prepare_lambda_function_builder_1.prepareLambdaFunctionBuilder();
    return builder(main, undefined);
};
