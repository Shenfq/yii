"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
class User extends src_1.BaseController {
    async before() {
        super.before();
        console.log('user load before');
    }
    async actionEnv() {
        this.ctx.body = this.config.env;
    }
    async actionUser() {
        this.ctx.body = 'hello user';
    }
    async actionUserInfo() {
        this.ctx.body = 'hello userinfo';
    }
}
exports.default = User;
