"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(ctx) {
        this.ctx = ctx;
        this.app = ctx.app;
        this.config = ctx.app.config;
    }
    async before() {
        console.log('load before');
    }
    async after() {
        console.log('load after');
    }
}
exports.BaseController = BaseController;
