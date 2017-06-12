"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process_to_future_1 = require("./process-to-future");
exports.invokeProcess = function (process, params) {
    var ambience = {
        lambda: {
            event: params.event,
            context: undefined,
            callback: undefined,
        },
        result: params.result,
        environments: params.environments
    };
    return process_to_future_1.processToFuture(ambience, process);
};
