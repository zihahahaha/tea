import { createApp, defineAsyncComponent, markRaw } from 'vue';
import Window from "./Window.vue";
import { exports } from "tea/config";

//提供窗口风格，是否单例，默认应用图标，视图
//一个wndClass可以多次注册，但不要修改里面的数据,因为用其创建的window会共享其中数据
function registerWndClass(wndClass, view, parentNode) {
    const registeredWndClass = {
        icon: wndClass.icon,

        windowTitlebarFlag: wndClass.windowTitlebarFlag == undefined ? true : wndClass.windowTitlebarFlag,
        windowControlboxFlag: wndClass.windowControlboxFlag == undefined ? true : wndClass.windowControlboxFlag,
        windowMinimizeButtonFlag: wndClass.windowMinimizeButtonFlag == undefined ? true : wndClass.windowMinimizeButtonFlag,
        windowMaximizeButtonFlag: wndClass.windowMaximizeButtonFlag == undefined ? true : wndClass.windowMaximizeButtonFlag,
        windowCloseButtonFlag: wndClass.windowCloseButtonFlag == undefined ? true : wndClass.windowCloseButtonFlag,
        windowFullscreenableFlag: wndClass.windowFullscreenableFlag == undefined ? false : wndClass.windowFullscreenableFlag,
    };
    // 是否单例
    registeredWndClass.singleton = wndClass.singleton == undefined ? false : wndClass.singleton;
    if (typeof view == "string") {
        registeredWndClass.view = defineAsyncComponent(() => {
            return new Promise((resolve, reject) => {
                window.requirejs([view], (res) => {
                    if (res !== undefined) {
                        console.log(view, res);
                        resolve(res.default);
                    }
                    else {
                        reject();
                    }
                });
            });
        })
    }
    else {
        registeredWndClass.view = view;
    }
    registeredWndClass.wndInstances = [];
    registeredWndClass.parentNode = parentNode;
    // 初始化完成后允许创建window
    registeredWndClass.createWnd = createWnd;

    return registeredWndClass;
}

function create(wndClass, wndParam) {
    const task = exports.taskbar.createTask();
    let Wnd = {
        ...Window,
        data() {
            return {
                ...Window.data(),
                task: markRaw(task),
                title: wndParam.defaultTitle,
                icon: wndClass.icon,
                windowTitlebarFlag: wndClass.windowTitlebarFlag,
                windowControlboxFlag: wndClass.windowControlboxFlag,
                windowMinimizeButtonFlag: wndClass.windowMinimizeButtonFlag,
                windowMaximizeButtonFlag: wndClass.windowMaximizeButtonFlag,
                windowCloseButtonFlag: wndClass.windowCloseButtonFlag,
                windowFullscreenableFlag: wndClass.windowFullscreenableFlag,
            }
        }
    }
    const wndApp = createApp(Wnd);
    wndApp.component("WINDOWCLIENT", wndClass.view);
    const container = document.createElement("div");
    wndClass.parentNode.appendChild(container);
    const wndIns = wndApp.mount(container);

    // 2. 把组件实例做成窗口对象
    const wnd = {};
    //用原型可以隐式的拥有组件实例，删除也是方便
    Object.setPrototypeOf(wnd, wndIns);
    // 该方法顺序相关，必须在所有事件完成后调用
    wndIns.__destroy = () => {
        if (wndIns.task) {
            wndIns.task.close();
        }
        Object.setPrototypeOf(wnd, null);
        wndApp.unmount();
        wndClass.parentNode.removeChild(container);
        //返回一个空对象
        delete wnd.task;
    };

    //这里以后再改，会给窗口暴露一个修改task的API
    // if (wndIns.task) {
    //     if (wndIns.task.getTitle() == undefined) {
    //         if (wndOption.defaultTaskTitle) {
    //             wndIns.task.setTitle(wndOption.defaultTaskTitle);
    //         }
    //         else {
    //             wndIns.task.setTitle(wndOption.defaultTitle);
    //         }
    //     }
    //     if (wndIns.task.getIcon() == undefined) {
    //         if (wndOption.defaultTaskIcon) {
    //             wndIns.task.setIcon(wndOption.defaultTaskIcon);
    //         }
    //         else {
    //             wndIns.task.setIcon(wndOption.defaultIcon);
    //         }
    //     }
    // }

    return wnd;
}


//返回窗口实例（窗口组件直接成为原型）
//{view, defaultTitle, defaultTaskTitle }
function createWnd(wndParam) {
    // 1. 创建窗口组件实例
    if (this.singleton) {
        if (this.wndInstances.length < 1) {
            const wnd = create(this, wndParam);
            this.wndInstances.push(wnd);
            wnd.addDestroyEventListener(() => {
                this.wndInstances.splice(this.wndInstances.indexOf(wnd), 1);
            });
            wnd.__focus();
            return wnd;
        }
        else {
            if (this.wndInstances[0].__raise) this.wndInstances[0].__raise(true);
            this.wndInstances[0].__focus();
            return null;
        }
    }
    else {
        const wnd = create(this, wndParam);
        this.wndInstances.push(wnd);
        wnd.addDestroyEventListener(() => {
            this.wndInstances.splice(this.wndInstances.indexOf(wnd), 1);
        });
        wnd.__focus();
        return wnd;
    }
}



export { registerWndClass };