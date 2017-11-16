"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var processes_1 = require("../processes");
var process_ambience_1 = require("../utilities/process-ambience");
var Processor = /** @class */ (function () {
    function Processor(params) {
        this.before = processes_1.getDefaultBeforeProcess();
        this.after = processes_1.getDefaultAfterProcess();
        this.response = processes_1.getDefaultResponseProcess();
        this.onError = processes_1.getDefaultOnErrorProcess();
        this.main = params.main;
        this.enviroments = params.environments;
        if (typeof params.before !== 'undefined') {
            this.before = params.before;
        }
        if (typeof params.after !== 'undefined') {
            this.after = params.after;
        }
        if (typeof params.response !== 'undefined') {
            this.response = params.response;
        }
        if (typeof params.onError !== 'undefined') {
            this.onError = params.onError;
        }
    }
    Processor.prototype.toHandler = function () {
        var _this = this;
        var environments = this.enviroments;
        return function (event, context, callback) {
            Promise.resolve()
                .then(function (result) { return _this.before(process_ambience_1.generateProcessAmbience({ result: result, environments: environments, event: event, context: context, callback: callback })); })
                .then(function (result) { return _this.main(process_ambience_1.generateProcessAmbience({ result: result, environments: environments, event: event, context: context, callback: callback })); })
                .then(function (result) { return _this.after(process_ambience_1.generateProcessAmbience({ result: result, environments: environments, event: event, context: context, callback: callback })); })
                .then(function (result) { return _this.response(process_ambience_1.generateProcessAmbience({ result: result, environments: environments, event: event, context: context, callback: callback })); }, function (result) { return _this.onError(process_ambience_1.generateProcessAmbience({ result: result, environments: environments, event: event, context: context, callback: callback })); })
                .then(function (result) { return callback(undefined, result); })
                .catch(function (error) {
                callback(undefined, { statusCode: 500, body: 'Fatal error occured.' });
            });
        };
    };
    return Processor;
}());
exports.Processor = Processor;
//# sourceMappingURL=index.js.map