"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const loader_1 = require("./loader");
class Yii extends Koa {
    constructor(options = {}) {
        super();
        this.config = {};
        this.name = 'app';
        this.static = 'public';
        this.port = 3000;
        this.name = options.name || this.name;
        this.port = options.port || this.port;
        this.static = options.static || this.static;
        this.loader = new loader_1.Loader(this);
    }
    run(port = this.port) {
        this.loader.load();
        return this.listen(port);
    }
}
exports.default = Yii;
