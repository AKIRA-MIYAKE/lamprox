"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var processor_1 = require("../processor");
exports.prepareLambdaFunctionBuilder = function (options, settings) {
    if (options === void 0) { options = {}; }
    if (settings === void 0) { settings = {}; }
    var preparedOptions = options;
    return function (main, environments, options) {
        if (options === void 0) { options = {}; }
        var _options = Object.assign({}, preparedOptions, options);
        var processor = new processor_1.Processor(main, environments, _options, settings);
        return processor.getLambdaFunction();
    };
};
