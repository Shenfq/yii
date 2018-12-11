"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class BaseController extends base_1.default {
    constructor(ctx) {
        super(ctx);
    }
    async before() {
        console.log('load controller before');
    }
    async after() {
        console.log('load controller after');
    }
}
exports.BaseController = BaseController;
