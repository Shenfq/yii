import * as Koa from 'koa'
import { Loader } from './loader'

interface Options {
  port: number
  name: string
}

export default class Noo extends Koa {
  public config: any = {}
  public name: string = 'app'
  private port: number = 3000
  private loader: Loader

  constructor (options: Options) {
    super()
    this.name = options.name
    this.port = options.port
    this.loader = new Loader(this)
  }

  run (port: number = this.port) {
    this.loader.load()
    return this.listen(port)
  }
}
