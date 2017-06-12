"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process_to_future_1 = require("./process-to-future");
exports.extendProcess = function (parent, ex) {
    return function (ambience, promise) {
        process_to_future_1.processToFuture(ambience, parent)
            .onComplete(function (trier) { return trier.match({
            Success: function (ambience) { return ex(ambience, promise); },
            Failure: function (error) { return promise.failure(error); }
        }); });
    };
};
