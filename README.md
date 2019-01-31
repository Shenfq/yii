# yii

基于 koa2 和 typescript 的业务框架，设计上有参考了 Egg.js，与 Egg.js 一样奉行 **『约定优于配置』**。名字来源于之前经常使用的一款PHP框架 —— Yii。

## 快速开始

```bash
npm i -S yii
npm i -D ts-node typescript
```

启动项目很简单，新建文件`app.ts`，输入如下代码。

```javascript
import Yii from 'yii'

// 使用run启动项目，参数表示监听的端口
new Yii().run(3000)
```

然后运行下面的命令启动项目。

```bash
npx ts-node ./app.ts
```

## 目录结构

```
├── app # 项目文件夹
│   ├── controller # 控制器
│   ├── service # 服务
│   ├── public # 静态资源
│   ├── middleware # 中间件
│   ├── config # 配置文件
│   │   └── index.ts # 默认配置文件
│   │   └── dev.ts # 开发环境配置文件
│   │   └── prod.ts # 正式环境配置文件
│   ├── component # 组件
├── app.ts # 项目启动文件
```

伴随启动文件的是一个文件目录，这个目录名是可以自定义的，可以在启动文件中配置，默认为`app`。

```javascript
new Yii({
  name: 'demo'
}).run(3000)
```

下面一一介绍各个目录的作用。

## 控制器 Controller

所有的控制器都放在`app/controller`文件夹下，且名字必须以`Controller`结尾，控制器文件属于应用的核心，因为路由也是基于控制器的，下面是一个控制器模版。

```javascript
// app/controller/SiteController.ts
import { BaseController, Action } from 'yii'

export default class Site extends BaseController {

  async before() {
    console.log('Site Controller before')
  }

  async after() {
    console.log('Site Controller after')
  }

  @Action.get
  async info(ctx: any) {
    ctx.body = 'hello site info'
  }

  @Action.post
  async getSiteInfo(ctx: any) {
    ctx.body = 'site info'
  }

}
```

所有的控制器需要继承`BaseController`，且两个方法`before`和`after`，请求到来时，每次先经过`before`方法，然后请求处理完毕后，再经过`after`方法。

控制器中的方法如果被`Action`装饰器修饰后，就会变成一个对外暴露的路由，比如上面的`info`方法。请求的路由为对应的控制器名 + 方法名，如果我要请求`SiteController`的`info`方法，如下：

```bash
curl http://localhost:3000/site/info
```

如果方法名或者控制器名使用了驼峰方式，会自动转成横杠连接，比如请求`getSiteInfo`方法，如下：

```bash
curl http://localhost:3000/site/get-site-info
```

### Action装饰器

`Action`装饰器下面对应了常用的http方法：

```javascript
const Methods = [
  'HEAD',
  'OPTIONS',
  'GET',
  'PUT',
  'PATCH',
  'POST',
  'DELETE'
]
Methods.push('ALL')
```

如果使用 `@Action.all` 修饰方法，表示能使用任意方法进行访问。

## 服务 Service

所有的服务都放在`app/service`文件夹下，且名字必须以`Service`结尾，服务表示业务逻辑的进一步抽象，如果有多个控制器调用某个逻辑，那么就可以考虑把这段逻辑抽象到服务中。

```javascript
// app/service/UserService.ts
import { BaseService } from '../../lib'

export default class User extends BaseService {
  getName() {
    return 'shenfq'
  }
}
```

所用的控制器都可以在`ctx`中访问服务的实例。

```javascript
@Action.get
async useService(ctx: any) {
  const userService = ctx.service.user
  ctx.body = userService.getName()
}
```

## 中间件 Middleware

`app/middleware`文件夹下，存放中间件，每个文件都会暴露一个方法，该方法会传入`koa`的`use`方法。所有`middleware`的优先级都高于控制器的方法调用。

```javascript
// app/middleware/log.ts
import { BaseContext } from 'koa'
export default async function (ctx: BaseContext, next: Function) {
  console.log('调用中间件')
  next()
}
```

框架默认使用了两个中间件`koa-static` 和 `koa-bodyparser`。

`koa-static`会设置一个静态资源的文件夹，默认是public文件夹，但是也可以在启动应该的时候进行自定义。

```javascript
new Yii({
  name: 'app',
  static: 'static'
}).run(3000)
```

## 配置 Config

```
├── config # 配置文件
│   └── index.ts # 默认配置文件
│   └── dev.ts # 开发环境配置文件
│   └── prod.ts # 正式环境配置文件
│   └── other.ts # 其他配置文件
```

在config文件夹下编写配置文件，一般会有是三个默认的配置文件，分别是`index.ts`、`dev.ts`、`prod.ts`。`index.ts`每次都会加载，而另外两个文件，如果`process.env.NODE_ENV` 为 `development` 则加载`dev.ts`，其他情况加载`prod.ts`。

其他配置文件会根据文件名，合并成一个对象。

```javascript
//a.ts
export default{
  name: 'a'
}
//b.ts
export default{
  name: 'b'
}
// merge
{
  a: { name: 'a' },
  b: { name: 'b' }
}
```

最后会将默认配置、环境变量配置以及其他配置通过`Object.assign()`方法合并成一个对象，挂载到框架对象下。

想要在控制器或者服务中调用，只需要使用 `this.config` 即可获得该对象。


## TODO

- [ ] 发布脚本
- [ ] 完善组件
- [ ] 测试用例
- [ ] cli工具

