// 导出一些全局对象

//一个全局的style表
const style = document.createElement("style");
document.head.appendChild(style);

//desktopClient,taskbar
//style
const exports = {
    style,
};


export { exports };