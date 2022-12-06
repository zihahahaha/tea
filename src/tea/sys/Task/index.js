import { createApp } from 'vue';
import Task from "./Task.vue";
import { insertAfter } from "@/__utils/dom.js";

function registerTaskClass(taskClass, parentNode) {
    const registeredTaskClass = { ...taskClass };
    registeredTaskClass.parentNode = parentNode;
    registeredTaskClass.createTask = createTask;
    return registeredTaskClass;
}

function createTask(taskOption) {
    const taskApp = createApp(Task);
    const container = document.createElement("div");
    const taskIns = taskApp.mount(container);
    this.parentNode.appendChild(container);

    taskIns.__destroy = () => {
        Object.setPrototypeOf(task, null);
        task.__app.unmount();
        this.parentNode.removeChild(container);
        delete task.__app;
    }

    const task = {};
    task.__app = taskApp;
    Object.setPrototypeOf(task, taskIns);

    // 处理一下容器
    container.setAttribute("draggable", "true");
    container.addEventListener("dragstart", (e) => {
        container.id = "dragtask";
    });
    // 拖拽目标容器
    container.addEventListener("dragenter", (e) => {
        taskIns.dragOverFlag = true;
    });
    container.addEventListener("dragleave", () => {
        taskIns.dragOverFlag = false;
    });
    container.addEventListener("dragover", e => e.preventDefault());
    container.addEventListener("drop", (e) => {
        taskIns.dragOverFlag = false;
        let ele = document.querySelector("#dragtask");
        if (ele !== undefined) {
            ele.id = "";
            let nodes = container.parentElement.childNodes;
            let eleIndex, targetIndex;
            for (let i = 0; i < nodes.length; ++i) {
                if (nodes[i] == ele) eleIndex = i;
                if (nodes[i] == container) targetIndex = i;
            }
            if (targetIndex > eleIndex) {
                insertAfter(container, ele);
            }
            else {
                container.parentElement.insertBefore(ele, container);
            }
        }
    });
    return task;
}

export { registerTaskClass };
