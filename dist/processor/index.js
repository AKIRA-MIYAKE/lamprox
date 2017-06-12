"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monapt_1 = require("monapt");
var processes_1 = require("../processes");
var fatal_error_handler_1 = require("./fatal-error-handler");
var utils_1 = require("../utils");
var Processor = (function () {
    function Processor(main, environments, options, settings) {
        if (options === void 0) { options = {}; }
        if (settings === void 0) { settings = {}; }
        this.main = main;
        this.environments = environments;
        this.before = processes_1.Processes.getBeforeProcess();
        this.onSuccess = processes_1.Processes.getOnSuccessProcess();
        this.onFailure = processes_1.Processes.getOnFailureProcess();
        this.after = processes_1.Processes.getAfterProcess();
        this.fatalErrorHandler = fatal_error_handler_1.fatalErrorHandler;
        if (typeof options.before !== 'undefined') {
            this.before = options.before;
        }
        if (typeof options.onSuccess !== 'undefined') {
            this.onSuccess = options.onSuccess;
        }
        if (typeof options.onFailure !== 'undefined') {
            this.onFailure = options.onFailure;
        }
        if (typeof options.after !== 'undefined') {
            this.after = options.after;
        }
        if (typeof settings.fatalErrorHandler !== 'undefined') {
            this.fatalErrorHandler = settings.fatalErrorHandler;
        }
    }
    Processor.prototype.getLambdaFunction = function () {
        var _this = this;
        return function (event, context, callback) {
            monapt_1.future(function (promise) {
                monapt_1.Future.succeed({
                    lambda: { event: event, context: context, callback: callback },
                    result: undefined,
                    environments: _this.environments
                })
                    .flatMap(function (ambience) { return utils_1.processToFuture(ambience, _this.before); })
                    .flatMap(function (ambience) { return utils_1.processToFuture(ambience, _this.main); })
                    .onComplete(function (trier) { return trier.match({
                    Success: function (ambience) {
                        utils_1.processToFuture(ambience, _this.onSuccess)
                            .onComplete(function (trier) { return trier.match({
                            Success: function (ambience) { return promise.success(ambience); },
                            Failure: function (error) { return promise.failure(error); }
                        }); });
                    },
                    Failure: function (error) {
                        utils_1.processToFuture({
                            lambda: { event: event, context: context, callback: callback },
                            result: error,
                            environments: _this.environments
                        }, _this.onFailure)
                            .onComplete(function (trier) { return trier.match({
                            Success: function (ambience) { return promise.success(ambience); },
                            Failure: function (error) { return promise.failure(error); }
                        }); });
                    }
                }); });
            })
                .flatMap(function (ambience) { return utils_1.processToFuture(ambience, _this.after); })
                .onComplete(function (trier) { return trier.match({
                Success: function (ambience) {
                    callback(undefined, ambience.result);
                },
                Failure: function (error) {
                    _this.fatalErrorHandler(error, callback);
                }
            }); });
        };
    };
    return Processor;
}());
exports.Processor = Processor;
