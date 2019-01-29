"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Methods = [
    'HEAD',
    'OPTIONS',
    'GET',
    'PUT',
    'PATCH',
    'POST',
    'DELETE'
];
Methods.push('ALL');
class Action {
    constructor() {
        this.routes = {};
    }
    get Routes() {
        return this.routes;
    }
    transformName(name) {
        return name
            .replace(/^[A-Z]/, (char) => {
            return char.toLowerCase();
        })
            .replace(/([A-Z])/g, (char) => {
            return '-' + char.toLowerCase();
        });
    }
}
Methods.forEach(method => {
    method = method.toLowerCase();
    Object.defineProperty(Action.prototype, method.toLowerCase(), {
        get: function () {
            return (target, property) => {
                const constructor = target.constructor;
                const name = this.transformName(constructor.name);
                const route = {
                    constructor,
                    property,
                    method,
                    name: this.transformName(property)
                };
                if (Array.isArray(this.routes[name])) {
                    this.routes[name].push(route);
                }
                else {
                    this.routes[name] = [route];
                }
            };
        }
    });
});
exports.action = new Action;
