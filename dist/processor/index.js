"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var processes_1 = require("../processes");
var utilities_1 = require("../utilities");
var Processor = (function () {
    function Processor(main, environments, options) {
        if (options === void 0) { options = {}; }
        this.main = main;
        this.environments = environments;
        this.before = processes_1.getDefaultBeforeProcess();
        this.after = processes_1.getDefaultAfterProcess();
        this.response = processes_1.getDefaultResponseProcess();
        this.onError = processes_1.getDefaultOnErrorProcess();
        if (typeof options.before !== 'undefined') {
            this.before = options.before;
        }
        if (typeof options.after !== 'undefined') {
            this.after = options.after;
        }
        if (typeof options.response !== 'undefined') {
            this.response = options.response;
        }
        if (typeof options.onError !== 'undefined') {
            this.onError = options.onError;
        }
    }
    Processor.prototype.toHandler = function () {
        var _this = this;
        return function (event, context, callback) {
            Promise.resolve(undefined)
                .then(function (result) { return _this.before(utilities_1.generateProcessAmbience({ event: event, context: context, callback: callback, result: result, environments: _this.environments })); })
                .then(function (result) { return _this.main(utilities_1.generateProcessAmbience({ event: event, context: context, callback: callback, result: result, environments: _this.environments })); })
                .then(function (result) { return _this.after(utilities_1.generateProcessAmbience({ event: event, context: context, callback: callback, result: result, environments: _this.environments })); })
                .then(function (result) { return _this.response(utilities_1.generateProcessAmbience({ event: event, context: context, callback: callback, result: result, environments: _this.environments })); }, function (error) { return _this.onError(utilities_1.generateProcessAmbience({ event: event, context: context, callback: callback, result: error, environments: _this.environments })); })
                .then(function (result) { return callback(undefined, result); });
        };
    };
    return Processor;
}());
exports.Processor = Processor;
