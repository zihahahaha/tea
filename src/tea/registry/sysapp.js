// 安装应用并创建快捷方式

import { registerWndClass } from "tea/sys";
import { exports, shortcuts } from "tea/config";

const sysAppRegistry = {}

function installSystemApp(id, app) {
    if (sysAppRegistry[id] == undefined) {
        sysAppRegistry[id] = registerWndClass(app.wndClass, app.view, exports.desktopClient.$refs.wnds);
    }
    else {
        console.log(`${id}已存在`);
    }
}

function searchSystemApp(id) {
    if (sysAppRegistry[id]) {
        return sysAppRegistry[id];
    }
    else {
        console.log(`系统应用${id}不存在`);
    }
}

export { installSystemApp, searchSystemApp };