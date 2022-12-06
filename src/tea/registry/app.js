// 安装应用,id为app组件地址

import { registerWndClass } from "tea/sys";
import { exports } from "tea/config";
import { shallowReactive, ShallowReactive } from "vue";

const appRegistry = shallowReactive({});

// app必须属性{name:string,wndClass:object}
// 近端App:{id:string,view:componet object} 需要自己维护id的唯一性
// 远端app:{view:url} url本身作为id
function installApp(app, localFlag) {
    if (localFlag) {
        if (appRegistry[app.id] == undefined) {
            appRegistry[app.id] = {
                wndClass: registerWndClass(app.wndClass, app.view, exports.desktopClient.$refs.wnds),
                name: app.name,
            }
        }
        else {
            console.log(`${app.name}注册失败,${app.id}已存在`);
        }
    }
    else {
        if (appRegistry[app.view] == undefined) {
            appRegistry[app.view] = {
                wndClass: registerWndClass(app.wndClass, app.view, exports.desktopClient.$refs.wnds),
                name: app.name,
            }
        }
        else {
            console.log(`${app.name}注册失败,${app.view}已存在`);
        }
    }
}

function searchApp(id) {
    if (appRegistry[id]) {
        return appRegistry[id].wndClass;
    }
    else {
        console.log(`不存在应用id:${id}`);
    }
}

function uninstallApp(id) {
    delete appRegistry[id];
}

export { installApp, uninstallApp, searchApp, appRegistry };