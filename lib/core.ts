import * as Koa from 'koa'
import { Loader } from './loader'

interface Options {
  port?: number
  name?: string
  static?: string
}

export default class Yii extends Koa {
  config: any = {}
  name: string = 'app'
  static: string = 'public'
  private port: number = 3000
  private loader: Loader

  constructor (options: Options = {}) {
    super()
    this.name = options.name || this.name
    this.port = options.port || this.port
    this.static = options.static || this.static
    this.loader = new Loader(this)
  }

  run (port: number = this.port) {
    this.loader.load()
    return this.listen(port)
  }
}
