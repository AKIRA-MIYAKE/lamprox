"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prepare_lambda_function_builder_1 = require("./prepare-lambda-function-builder");
exports.createLambdaFunction = function (main, environments, options, settings) {
    if (options === void 0) { options = {}; }
    var builder = prepare_lambda_function_builder_1.prepareLambdaFunctionBuilder(options, settings);
    return builder(main, environments);
};
