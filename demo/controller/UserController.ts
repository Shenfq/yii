import { BaseController, Action } from '../../lib'

export default class User extends BaseController {

  async before () {
    super.before()
    console.log('load user controller before')
  }

  @Action.post
  async env(ctx: any) {
    const logger = (<any>this.app).logger
    logger.info('test component')
    ctx.body = this.config.env
  }

  @Action.get
  async userService(ctx: any) {
    const userService = ctx.service.user
    ctx.body = userService.getName()
  }

  @Action.all
  async user(ctx: any) {
    ctx.body = 'hello user'
  }

  @Action.get
  async UserInfo(ctx: any) {
    ctx.body = 'hello userinfo'
  }

}
