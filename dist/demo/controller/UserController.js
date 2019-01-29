"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
class User extends lib_1.BaseController {
    async before() {
        super.before();
        console.log('load user controller before');
    }
    async env(ctx) {
        const logger = this.app.logger;
        logger.info('test component');
        ctx.body = this.config.env;
    }
    async userService(ctx) {
        const userService = ctx.service.user;
        ctx.body = userService.getName();
    }
    async user(ctx) {
        ctx.body = 'hello user';
    }
    async UserInfo(ctx) {
        ctx.body = 'hello userinfo';
    }
}
__decorate([
    lib_1.Action.post
], User.prototype, "env", null);
__decorate([
    lib_1.Action.get
], User.prototype, "userService", null);
__decorate([
    lib_1.Action.all
], User.prototype, "user", null);
__decorate([
    lib_1.Action.get
], User.prototype, "UserInfo", null);
exports.default = User;
