"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./base/controller"));
__export(require("./base/service"));
var router_1 = require("./router");
exports.Action = router_1.action;
const core_1 = require("./core");
exports.default = core_1.default;
