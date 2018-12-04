"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const loader_1 = require("./loader");
class Noo extends Koa {
    constructor(options) {
        super();
        this.config = {};
        this.name = 'app';
        this.port = 3000;
        this.name = options.name;
        this.port = options.port;
        this.loader = new loader_1.Loader(this);
    }
    run(port = this.port) {
        this.loader.load();
        return this.listen(port);
    }
}
exports.default = Noo;
