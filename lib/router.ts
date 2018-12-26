// import { BaseContext } from 'koa'
export interface RouteModule {
  method: string,
  name: string,
  property: string,
  constructor: any
}
interface Decorator {
  (target: any, property: string): void
}
interface RoutesModule {
  [key: string]: RouteModule
}
interface Router {
  all: Decorator
  get: Decorator
  post: Decorator
  patch: Decorator
  del: Decorator
  delete: Decorator
  options: Decorator
  put: Decorator,
  Routes: RoutesModule
}
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
class Action {
  private routes: RoutesModule = {};

  get Routes() {
    return this.routes
  }

  transformName(name: string): string {
    return name
      .replace(/^[A-Z]/, (char: string): string => {
        return char.toLowerCase()
      })
      .replace(/([A-Z])/g, (char: string): string => {
        return '-' + char.toLowerCase()
      })
  }

}

Methods.forEach(method => {
  method = method.toLowerCase()
  Object.defineProperty(Action.prototype, method.toLowerCase(), {
    get: function () {
      return (target: any, property: string) => {
        const constructor = target.constructor
        const name = this.transformName(constructor.name)
        const route: RouteModule = {
          constructor,
          property,
          method,
          name: this.transformName(property)
        }
        if (Array.isArray(this.routes[name])) {
          this.routes[name].push(route)
        } else {
          this.routes[name] = [route]
        }
      }
    }
  })
})

export const action: Router = <any> new Action
