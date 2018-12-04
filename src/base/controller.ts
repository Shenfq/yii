import { BaseContext } from 'koa'
import Noo from '../core'

export class BaseController {
  ctx: BaseContext
  app: Noo
  config: any

  constructor (ctx: BaseContext) {
    this.ctx = ctx
    this.app = ctx.app
    this.config = ctx.app.config
  }

  async before() {
    console.log('load before')
  }

  async after() {
    console.log('load after')
  }
}
