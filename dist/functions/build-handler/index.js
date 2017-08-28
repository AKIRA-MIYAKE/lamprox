"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prepare_handler_builder_1 = require("../prepare-handler-builder");
exports.buildHandler = function (params) { return prepare_handler_builder_1.prepareHandlerBuilder()(params); };
