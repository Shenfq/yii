import * as fs from 'fs'
import * as path from 'path'
import * as Router from 'koa-router'
import { BaseContext } from 'koa'
import Noo from './core'

const CACHED = Symbol.for('cached')

function transformName (name: string): string {
  return name
  .replace(/^[A-Z]/, (char: string): string => {
    return char.toLowerCase()
  })
  .replace(/([A-Z])/g, (char: string): string => {
    return '-' + char.toLowerCase()
  })
}

interface FileModule {
  module: any,
  filename: string,
}

export class Loader {
  private router: any = new Router
  private controller: Array<FileModule> = []
  private service: Array<FileModule> = []
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
    // 优先加载配置
    this.loadConfig()
    // load控制器之后，依据控制器定义的方法生成路由
    this.loadController()
    this.loadRouter()

    this.loadService()
    // TODO: load others
    // this.loadComponent()
  }

  loadController() {
    this.controller = this.getFiles('controller')
  }

  loadRouter() {
    this.controller.forEach((file: FileModule) => {
      const { module: Controller, filename } = file
      const [name, suffix] = filename.split('.')
      const controllerName = name.slice(0, name.indexOf('Controller'))

      if (suffix !== 'ts' && suffix !== 'js') {
        //非controller文件
        return false
      }

      const actions = new Router
      const proto = Controller.prototype
      Object.getOwnPropertyNames(proto)
      .forEach(method => {

        const name = (method.split('action') || ['', ''])[1]

        if (method === 'constructor' || !name)  return
        // 监听所有请求方法
        // TODO: 后续修改成装饰器
        actions.all('/' + transformName(name), async (ctx: BaseContext) => {
          const instance = new Controller(ctx)
          instance.before && instance.before(ctx)
          instance[method] && instance[method](ctx)
          instance.after && instance.after(ctx)
        })

      })
      // 使用控制器名添加路由前缀
      this.router.use('/' + transformName(controllerName), actions.routes(), actions.allowedMethods())
    })

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
}
