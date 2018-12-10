import { BaseController } from '../../lib'

export default class User extends BaseController {

  async before () {
    super.before()
    console.log('user load before')
  }

  async actionEnv() {
    this.ctx.body = this.config.env
  }

  async actionUser() {
    this.ctx.body = 'hello user'
  }

  async actionUserInfo() {
    this.ctx.body = 'hello userinfo'
  }

}
