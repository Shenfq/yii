import { BaseContext } from "koa";

export class BaseService {
    ctx: BaseContext

    constructor(ctx: BaseContext) {
      this.ctx = ctx
    }
}
