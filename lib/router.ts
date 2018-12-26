const Methods = [
  'HEAD',
  'OPTIONS',
  'GET',
  'PUT',
  'PATCH',
  'POST',
  'DELETE'
]

class Action {
  private routes: any = {};

  getRoutes() {
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
      return (target: any, propertyKey: string) => {
        const constructor = target.constructor
        const name = this.transformName(constructor.name)
        const obj = {
          method,
          constructor,
          property: this.transformName(propertyKey)
        }
        if (Array.isArray(this.routes[name])) {
          this.routes[name].push(obj)
        } else {
          this.routes[name] = [obj]
        }
      }
    }
  })
})

export const action = new Action
