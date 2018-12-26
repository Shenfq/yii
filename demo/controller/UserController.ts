import { BaseController, Action } from '../../lib'

export default class User extends BaseController {

  async before () {
    super.before()
    console.log('load user controller before')
  }

  @Action.get
  async env() {
    this.ctx.body = this.config.env
  }

  @Action.all
  async user() {
    this.ctx.body = 'hello user'
  }

  @Action.get
  async UserInfo() {
    this.ctx.body = 'hello userinfo'
  }

}
