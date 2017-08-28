"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProcessAmbience = function (params) { return ({
    lambda: {
        event: params.event,
        context: params.context,
        callback: params.callback
    },
    result: params.result,
    environments: params.environments
}); };
