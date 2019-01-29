"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function default_1(ctx, next) {
    console.log('middleware console.log path: ', ctx.routerPath || ctx.path);
    next();
}
exports.default = default_1;
