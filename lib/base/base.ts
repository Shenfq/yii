import { BaseContext } from 'koa'
import Yii from '../core'
export default class BaseClass {
  public ctx: BaseContext
  public app: Yii
  public config: any

  constructor (ctx: BaseContext) {
    this.ctx = ctx
    this.app = ctx.app
    this.config = ctx.app.config
  }
}
