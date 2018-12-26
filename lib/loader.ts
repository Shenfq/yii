import * as fs from 'fs'
import * as path from 'path'
import * as Router from 'koa-router'
import { BaseContext } from 'koa'
import Noo from './core'
import { action, RouteModule } from './router'

const CACHED = Symbol.for('cached')

interface FileModule {
  module: any,
  filename: string,
}

export class Loader {
  private router: any = new Router
  private controller: Array<FileModule> = []
  private service: Array<FileModule> = []
  private middleware: Array<FileModule> = []
  private app: Noo
  get appDir() {
    const Idx = __dirname.indexOf('node_module')
    return Idx >= 0
      ? __dirname.slice(0, Idx)
      : __dirname.slice(0, -4)
  }
  private getFiles(module: string): Array<FileModule> {
    const dir = path.join(this.appDir, this.app.name, module)
    return fs.readdirSync(dir).map((name) => {
      const controllerPath = path.join(dir, name)
      return {
          module: require(controllerPath).default,
          filename: name
      }
    })
  }
  constructor(app: Noo) {
    this.app = app
  }

  // loader的主逻辑
  load() {
    // 加载中间件
    this.loadMiddleware()
    // 加载配置
    this.loadConfig()
    // load控制器之后，依据控制器定义的方法生成路由
    this.loadController()
    this.loadRouter()
    this.loadService()
    // TODO: loadComponent
    // this.loadComponent()
  }

  loadController() {
    this.controller = this.getFiles('controller')
  }

  loadRouter() {
    const Routes = action.Routes
    for (let controllerName in Routes) {
      const router:any = new Router
      const Actions: any = Routes[controllerName]
      Actions.forEach((route: RouteModule) => {
        const { method, constructor, property, name } = route
        router[method]('/' + name, async (ctx: BaseContext) => {
          const instance = new constructor(ctx)
          instance.before && instance.before(ctx)
          instance[property] && instance[property](ctx)
          instance.after && instance.after(ctx)
        })
      })
      this.router.use('/' + controllerName, router.routes(), router.allowedMethods())
    }

    this.app.use(this.router.routes())
  }

  loadConfig() {
    // 读取所有配置
    const configFiles = this.getFiles('config')
    const otherConf: any = {}
    configFiles.forEach((file: FileModule) => {
      const { module, filename } = file
      const [configName, suffix] = filename.split('.')

      if (suffix !== 'ts' && suffix !== 'js') {
        //非config
        return false
      }
      if (['index', 'prod', 'dev'].indexOf(configName) >= 0) {
        //固定读取的conf文件
        return false
      }

      otherConf[configName] = module
    })

    // 读取固定配置
    const configEnvPath = process.env.NODE_ENV === 'development'
      ? path.join(this.appDir, this.app.name, 'config/dev')
      : path.join(this.appDir, this.app.name, 'config/prod')
    const configDefPath = path.join(this.appDir, this.app.name, 'config/index')
    const configEnv = require(configEnvPath).default
    const configDef = require(configDefPath).default
    const config = Object.assign(this.app.config, configDef, configEnv, otherConf)
    Object.defineProperty(this.app, 'config', {
      get: () => config
    })
  }

  loadService() {
    this.service = this.getFiles('service')
    const serviceFiles = this.service
    Object.defineProperty(this.app.context, 'service', {
      // 获取运行时的ctx，所有逻辑需要写到getter中
      get() {
        if (!this[CACHED]) {
            this[CACHED] = {}
        }
        const cached: any = this[CACHED]
        if (!cached['service']) {
          cached['service'] = {}
          serviceFiles.forEach((file: FileModule) => {
            const { module: Service, filename } = file
            const [name, suffix] = filename.split('.')
            const ServiceName = name.slice(0, name.indexOf('Service'))

            if (suffix !== 'ts' && suffix !== 'js') {
              //非service文件
              return false
            }
            cached['service'][ServiceName.toLowerCase()] = new Service(this)
          })
        }

        return cached['service']
      }
    })
  }

  loadComponent() {

  }


  defaulMiddleware() {
    const Static = require('koa-static')
    const bodyParser = require('koa-bodyparser')
    this.app.use(Static(path.join(this.appDir, this.app.name, this.app.static)))
    this.app.use(bodyParser())
  }

  loadMiddleware() {
    this.defaulMiddleware()
    this.middleware = this.getFiles('middleware')
    const middlewareFiles = this.middleware
    middlewareFiles.forEach((file: FileModule) => {
      const { module, filename } = file
      const suffix = filename.split('.')[1]
      if (suffix !== 'ts' && suffix !== 'js') {
        //非ts或js文件
        return false
      }
      this.app.use(module)
    })

  }
}
