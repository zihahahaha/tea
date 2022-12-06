// 直接测试应用组件
import { createApp } from 'vue'
import Debug from "./debug.vue";

// 1. 初始化桌面环境，导出了两个组件实例
const app = createApp(Debug);
app.mount('#tea');

import { Setup } from "tea/sys_app";

// 2. 安装应用
// 系统应用
import { installSystemApp } from "tea/registry";
installSystemApp("setup", {
    wndClass: {
        singleton: true,
    },
    view: Setup,
});

//远端应用测试例
import remote from "./remote.js";
import { installApp } from "tea/registry";
import { shortcuts } from "tea/config";
remote.forEach(i => {
    installApp(i.app);
    shortcuts.value.push(i.shortcut);
});

import * as vue from "vue";
const t = vue;
define("vue", [], () => {
    return t;
});
