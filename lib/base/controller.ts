import { BaseContext } from 'koa'
import BaseClass from './base'

export class BaseController extends BaseClass {
  constructor (ctx: BaseContext) {
    super(ctx)
  }

  async before() {
    console.log('load controller before')
  }

  async after() {
    console.log('load controller after')
  }
}
