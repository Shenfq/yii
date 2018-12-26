import { BaseController, Action } from '../../lib'

export default class User extends BaseController {

  async before () {
    super.before()
    console.log('load user controller before')
  }

  @Action.get
  async actionEnv() {
    this.ctx.body = this.config.env
  }

  @Action.post
  async actionUser() {
    this.ctx.body = 'hello user'
  }

  async actionUserInfo() {
    this.ctx.body = 'hello userinfo'
  }

}
