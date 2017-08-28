"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var processor_1 = require("../../processor");
exports.prepareHandlerBuilder = function (preparedOptions) {
    if (preparedOptions === void 0) { preparedOptions = {}; }
    return function (params) {
        var processor = new processor_1.Processor(params.main, params.environments, Object.assign({}, preparedOptions, params.options));
        return processor.toHandler();
    };
};
