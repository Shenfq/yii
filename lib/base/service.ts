import { BaseContext } from 'koa'
import BaseClass from './base'

export class BaseService  extends BaseClass {
  constructor(ctx: BaseContext) {
    super(ctx)
  }
}
