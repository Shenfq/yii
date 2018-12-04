"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Router = require("koa-router");
function transformName(name) {
    return name
        .replace(/^[A-Z]/, (char) => {
        return char.toLowerCase();
    })
        .replace(/([A-Z])/g, (char) => {
        return '-' + char.toLowerCase();
    });
}
class Loader {
    constructor(app) {
        this.router = new Router;
        this.controllers = [];
        this.app = app;
    }
    get appDir() {
        const Idx = __dirname.indexOf('node_module');
        return Idx >= 0
            ? __dirname.slice(0, Idx)
            : __dirname.slice(0, -4);
    }
    getFiles(module) {
        const dir = path.join(this.appDir, this.app.name, module);
        return fs.readdirSync(dir).map((name) => {
            const controllerPath = path.join(dir, name);
            return {
                module: require(controllerPath).default,
                filename: name
            };
        });
    }
    // loader的主逻辑
    load() {
        // load控制器之后，依据控制器定义的方法生成路由
        this.loadController();
        this.loadRouter();
        // TODO: load others
        this.loadConfig();
        // this.loadService()
        // this.loadComponent()
    }
    loadController() {
        this.controllers = this.getFiles('controller');
    }
    loadRouter() {
        this.controllers.forEach(async (file) => {
            const { module: controller, filename } = file;
            const [name, suffix] = filename.split('.');
            const controllerName = name.slice(0, name.indexOf('Controller'));
            if (suffix !== 'ts' && suffix !== 'js') {
                //非controller文件
                return false;
            }
            const actions = new Router;
            Object.getOwnPropertyNames(controller.prototype)
                .forEach(method => {
                const name = (method.split('action') || ['', ''])[1];
                if (method === 'constructor' || !name)
                    return;
                actions.all('/' + transformName(name), async (ctx) => {
                    const instance = new controller(ctx);
                    instance.before && instance.before();
                    instance[method] && instance[method]();
                    instance.after && instance.after();
                });
            });
            this.router.use('/' + controllerName.toLowerCase(), actions.routes(), actions.allowedMethods());
        });
        this.app.use(this.router.routes());
    }
    loadConfig() {
        const configEnvPath = process.env.NODE_ENV === 'development'
            ? path.join(this.appDir, this.app.name, 'config/dev')
            : path.join(this.appDir, this.app.name, 'config/prod');
        const configDefPath = path.join(this.appDir, this.app.name, 'config/index');
        const configEnv = require(configEnvPath).default;
        const configDef = require(configDefPath).default;
        const config = Object.assign(this.app.config, configDef, configEnv);
        Object.defineProperty(this.app, 'config', {
            get: () => config
        });
    }
    loadService() { }
    loadComponent() { }
}
exports.Loader = Loader;
