"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const yii = new lib_1.default({
    name: 'demo',
    port: 3000
});
yii.run();
