"use strict";
var monapt_1 = require("monapt");
var Processor = (function () {
    function Processor(main, options) {
        if (options === void 0) { options = {}; }
        this.before = function (ambience, promise) {
            promise.success(null);
        };
        this.onSuccess = function (ambience, promise) {
            promise.success({
                statusCode: 200,
                headers: {},
                body: ambience.result
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
        this.main = main;
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
                monapt_1.Future.succeed({ lambda: { event: event, context: context, callback: callback }, result: null })
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
                        _wrapProcess({ lambda: { event: event, context: context, callback: callback }, result: error }, _this.onFailure)
                            .onComplete(function (trier) { return trier.match({
                            Success: function (ambience) { return promise.success(ambience); },
                            Failure: function (error) { return promise.failure(error); }
                        }); });
                    }
                }); });
            })
                .flatMap(function (ambience) { return _wrapProcess(ambience, _this.after); })
                .onComplete(function (trier) { return trier.match({
                Success: function (ambience) { ambience.lambda.callback(null, ambience.result); },
                Failure: function (error) { return _fatalErrorHandler(error, callback); }
            }); });
        };
    };
    return Processor;
}());
exports.Processor = Processor;
var _wrapProcess = function (ambience, process) {
    return monapt_1.future(function (promise) { return process(ambience, promise); })
        .map(function (result) { return ({ lambda: ambience.lambda, result: result }); });
};
var _fatalErrorHandler = function (error, callback) {
    callback(null, {
        statusCode: 500,
        headers: {},
        body: {
            error: 'Fatal Error',
            originalError: error
        }
    });
};
exports.prepareLambdaFunction = function (options) {
    if (options === void 0) { options = {}; }
    return function (main) { return new Processor(main, options).lambda(); };
};
exports.createLambdaFunction = function (main, options) {
    if (options === void 0) { options = {}; }
    return exports.prepareLambdaFunction(options)(main);
};
exports.lamprox = function (main) {
    return exports.createLambdaFunction(main);
};
//# sourceMappingURL=index.js.map