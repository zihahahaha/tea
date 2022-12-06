import { createApp } from 'vue';
import Modal from "./Modal.vue";


//创建Application
function registerModal(view, container) {
    let modal = {};
    modal.container = container;
    modal.view = view;

    modal.exec = exec;
    return modal;
}

//创建组件实例
function exec(option, callback) {
    const modalApp = createApp(Modal);
    modalApp.component("MODALCLIENT", this.view);
    const modalIns = modalApp.mount(this.container);


    modalIns.__destroy = () => {
        modalApp.unmount();
    };
    modalIns.setCallback(callback);

    modalIns.$el.focus({ preventScroll: true });
}

export { registerModal };
