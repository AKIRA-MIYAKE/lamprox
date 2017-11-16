"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var processor_1 = require("../processor");
exports.prepareHandlerBuilder = function (preparedParams) {
    if (preparedParams === void 0) { preparedParams = {}; }
    return function (params) {
        var _params = Object.assign({}, params, preparedParams);
        var processor = new processor_1.Processor(_params);
        return processor.toHandler();
    };
};
exports.buildHandler = function (params) {
    return exports.prepareHandlerBuilder()(params);
};
exports.lamprox = function (main) {
    return exports.buildHandler({ main: main, environments: undefined });
};
//# sourceMappingURL=index.js.map