"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
class User extends lib_1.BaseController {
    async before() {
        super.before();
        console.log('load user controller before');
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
