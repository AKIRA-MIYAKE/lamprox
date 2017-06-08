"use strict";
var monapt_1 = require("monapt");
var Processor = (function () {
    function Processor(main, options, environments) {
        if (options === void 0) { options = {}; }
        if (environments === void 0) { environments = undefined; }
        this.main = main;
        this.environments = environments;
        this.before = function (ambience, promise) {
            promise.success(undefined);
        };
        this.onSuccess = function (ambience, promise) {
            var body;
            if (typeof ambience.result === 'string') {
                body = ambience.result;
            }
            else {
                body = JSON.stringify(ambience.result);
            }
            promise.success({
                statusCode: 200,
                headers: {},
                body: body
            });
        };
        this.onFailure = function (ambience, promise) {
            promise.success({
                statusCode: 500,
                headers: {},
                body: ambience.result.message
            });
        };
        this.after = function (ambience, promise) {
            promise.success(ambience.result);
        };
        if ('before' in options) {
            this.before = options.before;
        }
        if ('onSuccess' in options) {
            this.onSuccess = options.onSuccess;
        }
        if ('onFailure' in options) {
            this.onFailure = options.onFailure;
        }
        if ('after' in options) {
            this.after = options.after;
        }
    }
    Processor.prototype.lambda = function () {
        var _this = this;
        return function (event, context, callback) {
            monapt_1.future(function (promise) {
                monapt_1.Future.succeed({ lambda: { event: event, context: context, callback: callback }, result: undefined, environments: _this.environments })
                    .flatMap(function (ambience) { return _wrapProcess(ambience, _this.before); })
                    .flatMap(function (ambience) { return _wrapProcess(ambience, _this.main); })
                    .onComplete(function (trier) { return trier.match({
                    Success: function (ambience) {
                        _wrapProcess(ambience, _this.onSuccess)
                            .onComplete(function (trier) { return trier.match({
                            Success: function (ambience) { return promise.success(ambience); },
                            Failure: function (error) { return promise.failure(error); }
                        }); });
                    },
                    Failure: function (error) {
                        _wrapProcess({ lambda: { event: event, context: context, callback: callback }, result: error, environments: _this.environments }, _this.onFailure)
                            .onComplete(function (trier) { return trier.match({
                            Success: function (ambience) { return promise.success(ambience); },
                            Failure: function (error) { return promise.failure(error); }
                        }); });
                    }
                }); });
            })
                .flatMap(function (ambience) { return _wrapProcess(ambience, _this.after); })
                .onComplete(function (trier) { return trier.match({
                Success: function (ambience) { ambience.lambda.callback(undefined, ambience.result); },
                Failure: function (error) { return _fatalErrorHandler(error, callback); }
            }); });
        };
    };
    return Processor;
}());
exports.Processor = Processor;
var _wrapProcess = function (ambience, process) {
    return monapt_1.future(function (promise) { return process(ambience, promise); })
        .map(function (result) { return ({ lambda: ambience.lambda, result: result, environments: ambience.environments }); });
};
var _fatalErrorHandler = function (error, callback) {
    callback(undefined, {
        statusCode: 500,
        headers: {},
        body: JSON.stringify({
            error: 'Fatal Error',
            originalError: error
        })
    });
};
exports.prepareLambdaFunction = function (options, environments) {
    if (options === void 0) { options = {}; }
    if (environments === void 0) { environments = undefined; }
    return function (main) { return new Processor(main, options, environments).lambda(); };
};
exports.createLambdaFunction = function (main, options, environments) {
    if (options === void 0) { options = {}; }
    if (environments === void 0) { environments = undefined; }
    return exports.prepareLambdaFunction(options, environments)(main);
};
exports.lamprox = function (main) {
    return exports.createLambdaFunction(main);
};
//# sourceMappingURL=/Users/miyakeakira/Documents/Repositories/lamprox/dist/index.js.map