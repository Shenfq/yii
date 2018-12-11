"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseClass {
    constructor(ctx) {
        this.ctx = ctx;
        this.app = ctx.app;
        this.config = ctx.app.config;
    }
}
exports.default = BaseClass;
