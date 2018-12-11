import { BaseContext } from 'koa'
import Noo from '../core'
export default class BaseClass {
  public ctx: BaseContext
  public app: Noo
  public config: any

  constructor (ctx: BaseContext) {
    this.ctx = ctx
    this.app = ctx.app
    this.config = ctx.app.config
  }
}
