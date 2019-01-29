"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(conf) {
        this.config = {};
        this.config = conf;
    }
    getConf() {
        return this.config;
    }
    info(ctx) {
        console.info(ctx);
    }
}
exports.default = Logger;
