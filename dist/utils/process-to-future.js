"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monapt_1 = require("monapt");
exports.processToFuture = function (ambience, process) { return monapt_1.future(function (promise) { return process(ambience, promise); })
    .map(function (result) { return ({
    lambda: ambience.lambda,
    result: result,
    environments: ambience.environments
}); }); };
