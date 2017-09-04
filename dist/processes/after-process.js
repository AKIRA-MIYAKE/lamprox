"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultAfterProcess = function () { return function (ambience) { return Promise.resolve(ambience.result); }; };
