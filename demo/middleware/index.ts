import { BaseContext } from 'koa'
export default async function (ctx: BaseContext, next: Function) {
  console.log(
    'middleware console.log path: ',
    ctx.routerPath || ctx.path
  )
  next()
}
