"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Router = require("koa-router");
const router_1 = require("./router");
const CACHED = Symbol.for('cached');
class Loader {
    constructor(app) {
        this.router = new Router;
        // private controller: Array<FileModule> = []
        this.service = [];
        this.middleware = [];
        this.component = [];
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
        try {
            return fs.readdirSync(dir).map((name) => {
                const controllerPath = path.join(dir, name);
                return {
                    module: require(controllerPath).default,
                    filename: name
                };
            });
        }
        catch (e) {
            return [];
        }
    }
    // loader的主逻辑
    load() {
        // 加载中间件
        this.loadMiddleware();
        // 加载配置
        this.loadConfig();
        // 加载插件
        this.loadComponent();
        // 加载服务
        this.loadService();
        // load控制器之后，依据控制器定义的方法生成路由
        this.loadController();
        this.loadRouter();
    }
    loadController() {
        // this.controller = this.getFiles('controller')
        return this.getFiles('controller');
    }
    loadRouter() {
        const Routes = router_1.action.Routes;
        for (let controllerName in Routes) {
            const router = new Router;
            const Actions = Routes[controllerName];
            Actions.forEach((route) => {
                const { method, constructor, property, name } = route;
                router[method]('/' + name, async (ctx) => {
                    const instance = new constructor(ctx);
                    instance.before && instance.before(ctx);
                    instance[property] && instance[property](ctx);
                    instance.after && instance.after(ctx);
                });
            });
            this.router.use('/' + controllerName, router.routes(), router.allowedMethods());
        }
        this.app.use(this.router.routes());
    }
    loadConfig() {
        // 读取所有配置
        const configFiles = this.getFiles('config');
        const otherConf = {};
        configFiles.forEach((file) => {
            const { module, filename } = file;
            const [configName, suffix] = filename.split('.');
            if (suffix !== 'ts' && suffix !== 'js') {
                //非config
                return false;
            }
            if (['index', 'prod', 'dev'].indexOf(configName) >= 0) {
                //固定读取的conf文件
                return false;
            }
            otherConf[configName] = module;
        });
        // 读取固定配置
        const configEnvPath = process.env.NODE_ENV === 'development'
            ? path.join(this.appDir, this.app.name, 'config/dev')
            : path.join(this.appDir, this.app.name, 'config/prod');
        const configDefPath = path.join(this.appDir, this.app.name, 'config/index');
        let configEnv = null;
        let configDef = null;
        try {
            configEnv = require(configEnvPath).default;
        }
        catch (e) {
            configEnv = {};
        }
        try {
            configDef = require(configDefPath).default;
        }
        catch (e) {
            configDef = {};
        }
        const config = Object.assign(this.app.config, configDef, configEnv, otherConf);
        Object.defineProperty(this.app, 'config', {
            get: () => config
        });
    }
    loadService() {
        this.service = this.getFiles('service');
        const serviceFiles = this.service;
        Object.defineProperty(this.app.context, 'service', {
            // 获取运行时的ctx，所有逻辑需要写到getter中
            get() {
                if (!this[CACHED]) {
                    this[CACHED] = {};
                }
                const cached = this[CACHED];
                if (!cached['service']) {
                    cached['service'] = {};
                    serviceFiles.forEach((file) => {
                        const { module: Service, filename } = file;
                        const [name, suffix] = filename.split('.');
                        const ServiceName = name.slice(0, name.indexOf('Service'));
                        if (suffix !== 'ts' && suffix !== 'js') {
                            //非service文件
                            return false;
                        }
                        cached['service'][ServiceName.toLowerCase()] = new Service(this);
                    });
                }
                return cached['service'];
            }
        });
    }
    loadComponent() {
        this.component = this.getFiles('component');
        const componentFiles = this.component;
        componentFiles.forEach(component => {
            const componentConfig = this.app.config.component || {};
            const { filename, module } = component;
            const [name] = filename.split('.');
            const instance = componentConfig[name]
                ? new module(componentConfig[name])
                : new module;
            console.log(name, componentConfig[name]);
            Object.defineProperty(this.app, name, {
                get: () => instance
            });
        });
    }
    defaulMiddleware() {
        const Static = require('koa-static');
        const bodyParser = require('koa-bodyparser');
        this.app.use(Static(path.join(this.appDir, this.app.name, this.app.static)));
        this.app.use(bodyParser());
    }
    loadMiddleware() {
        this.defaulMiddleware();
        this.middleware = this.getFiles('middleware');
        const middlewareFiles = this.middleware;
        middlewareFiles.forEach((file) => {
            const { module, filename } = file;
            const suffix = filename.split('.')[1];
            if (suffix !== 'ts' && suffix !== 'js') {
                //非ts或js文件
                return false;
            }
            this.app.use(module);
        });
    }
}
exports.Loader = Loader;
