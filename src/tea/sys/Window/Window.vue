<template>

  <transition name="show">
    <div 
      class="tea_window"
      tabindex="0"
      v-if="visibleFlag"
      :style="[
        wndStateStyle,
        { 'z-index':computedZ }
      ]"
      ref="wnd"
      @mousedown="__onMousedown"
      @contextmenu.stop
      @keydown="__onShortcutKey">

      <div
        v-if="windowControlboxFlag" 
        class="window-left_top" 
        v-move:nw-resize="{'move': __leftTop}" />
      <div
        v-if="windowControlboxFlag"  
        class="window-left_bottom" 
        v-move:ws-resize="{'move': __leftBottom}"/>
      <div
        v-if="windowControlboxFlag"  
        class="window-right_top" 
        v-move:ne-resize="{'move': __rightTop}" />
      <div
        v-if="windowControlboxFlag"  
        class="window_right-bottom" 
        v-move:se-resize="{'move': __rightBottom}" />
      <div 
        v-if="windowControlboxFlag" 
        class="window-top" 
        v-move:n-resize="{'move': __top}" />
      <div
        v-if="windowControlboxFlag"  
        class="window-left" 
        v-move:w-resize="{'move': __left}" />
      <div 
        v-if="windowControlboxFlag" 
        class="window-bottom"
        v-move:s-resize="{'move': __bottom}" />
      <div
        v-if="windowControlboxFlag"  
        class="window-right" 
        v-move:e-resize="{'move': __right}" />

      <div 
        class="window-inner"
        :style="
          {
            'width':`calc(100% - ${ windowControlboxFlag * 16 }px)`,
            'height':`calc(100% - ${ windowControlboxFlag * 16 }px)`,
            'top':`${ windowControlboxFlag * 8 }px`,
            'left':`${ windowControlboxFlag * 8 }px`,
          }">

        <div class="window-titlebar"
          v-if="windowTitlebarFlag"
          v-move="{ 'move': __move,'up': __up }"
          :class="{ 'window-titlebar--fakefocus': fakeFocusFlag }"
          @dblclick="__toggle"
          @contextmenu.prevent="__onContextMenu">
        
          <div class="titlebar-content">
            <img class="titlebar-icon" :src="icon" alt="" v-if="icon">
            <span class="titlebar-title">{{ title }}</span>
          </div>

          <div class="titlebar-btns"
            ref="titleBtns"
            @mousedown.stop>

          <div class="btn"
            v-if="windowMinimizeButtonFlag"
            @click="minimize">
            <svg width="30" height="35">
              <line x1="11" y1="18" x2="20" y2="18" />
            </svg>
          </div>

          <div class="btn" 
            v-if="windowMaximizeButtonFlag"
            v-show="wndState=='window'"
            @click="maximize">
            <svg width="30" height="35">
              <polygon points="10,13 20,13 20,23 10,23" />
            </svg>
          </div>
          <div class="btn"
            v-if="windowMaximizeButtonFlag"
            v-show="wndState=='max'"
            @click="windowing">
            <svg width="30" height="35">
              <polygon points="8,14 16,14 16,22 8,22" />
              <polyline points="11,14 11,11 19,11 19,19 16,19" />
            </svg>
          </div>

          <div class="btn"
            @click="close"
            v-if="windowCloseButtonFlag">
            <svg width="30" height="35">
              <line x1="10" y1="13" x2="19" y2="22" />
              <line x1="19" y1="13" x2="10" y2="22" />
            </svg>
          </div>

          </div>
        </div>
            
        <div 
          ref="windowClient"
          class="window-client"
          :style="{ 
            'top': `${ windowTitlebarFlag * 35 }px`,
            'height': `calc(100% - ${ windowTitlebarFlag * 35 }px)`,
          }">
          <WINDOWCLIENT />
        </div>
      </div>

      <div class="window-modal" ref="modals" />

      <ContextMenu ref="contextmenu">
        <Action 
          title="移动"
          @click.stop="__onMove" />
        <Action 
          title="关闭窗口"
          @click.stop="__onClose" />
      </ContextMenu>

    </div>
  </transition>

</template>

<script>
import { move } from "tea/__directive/cursor.js";
import { constant, desktop } from "tea/config";
import { registerModal } from "tea/sys/Modal";  

// 系统菜单(上下文菜单)
import { ContextMenu, Action } from "cn/Menus";

// 默认模态框
import { ImgPicker } from "tea/sys_app";
import { isParent } from '@/__utils/dom';

import { exports } from "tea/config/exports";
const style = exports.style;


export default {
  //由于该组件作为所有app容器，不用太考虑样式，复用性低

  name: "tea-window",

  components: {
    ContextMenu, Action,
  },

  directives: {
    move
  },

  setup() {
    return {
      registerModal,
    }
  },

  data() {
    return {
      // 窗口标志,直接暴露吧，不写setter，getter了
      windowTitlebarFlag: undefined,
      windowControlboxFlag: undefined,
      windowMinimizeButtonFlag: undefined,
      windowMaximizeButtonFlag: undefined,
      windowCloseButtonFlag: undefined,
      windowSystemMenuFlag: undefined,

      windowFullscreenableFlag: undefined,

      visibleFlag: true,
      fakeFocusFlag: false,
      moveModeFlag: false,
      // task: undefined,
      x: 100,
      y: 100,
      z: 0,
      width: 640,
      height: 480,
      //window | max | min | fullscreen
      wndState: "window",
      preWndState: "window",
      title: undefined,
      icon: undefined,
      posMode: undefined,
      task:undefined,
      
      //listeners
      destroyEventListeners: [],
      visibleEventListeners: [],
      mousedownEventListeners: [],
    }
  },

  computed: {
    wndStateStyle() {
      if (this.wndState == "window")
        return this.windowStyle;
      else if (this.wndState == "max")
        return this.maxStyle;
      else if (this, this.wndState == "maxH")
        return this.maxHStyle;
      else if (this.wndState == "min")
        return this.minStyle;
      else if (this.wndState == "fullscreen")
        return this.fullscreenStyle;
    },
    minStyle() {
      const styles = {};

      styles["display"] = "none";

      return styles;
    },
    maxStyle() {
      const styles = {};

      styles["width"] = `calc(100% + ${this.windowControlboxFlag * 16}px)`;
      styles["height"] = `calc(100% + ${this.windowControlboxFlag * 16}px)`;
      styles["left"] = `${this.windowControlboxFlag * -8}px`;
      styles["top"] = `${this.windowControlboxFlag * -8}px`;

      return styles;
    },
    windowStyle() {
      const styles = {};

      styles["width"] = `${this.width + this.windowControlboxFlag * 16}px`;
      styles["height"] = `${this.height + this.windowControlboxFlag * 16}px`;
      styles["left"] = `${this.x - this.windowControlboxFlag * 8}px`;
      styles["top"] = `${this.y - this.windowControlboxFlag * 8}px`;

      return styles;
    },
    fullscreenStyle() {
      const styles = {};

      styles["width"] = `calc(100% + 16px)`;
      styles["height"] = `calc(100% + 16px + 35px)`;
      styles["left"] = "-8px";
      styles["top"] = "-43px";

      return styles;
    },
    computedZ() {
      return this.z + constant.reserveZ;
    },
  },

  methods: {
    //PRIVATE:

    __onTaskClick(taskActive) {
      if (this.wndState == "min") {
        this.__raise();
        this.__focus();
        return;
      }
      if (taskActive) {
        this.minimize();
      }
      else {
        if (this.__raise) this.__raise();
        this.__focus();
      }
    },
    __onShortcutKey(e) {
      // Ctrl + F11 全屏化
      if (e.key == "F11" && e.ctrlKey == true) {
        if (this.wndState == "fullscreen") {
          this.__backFromFullscreen();
        }
        else if (this.wndState != "min") {
          this.fullscreening();
        }
      }
      // Ctrl + 空格 窗口系统菜单
      if (e.key == " " && e.ctrlKey == true) {
        let rect = this.$refs.windowClient.getBoundingClientRect();
        let x = this.x > 0 ? rect.x : rect.x - this.x;
        let y = this.y > 0 ? rect.y : rect.y - this.y - this.windowTitlebarFlag * 35;
        this.$refs.contextmenu.show(x, y);
      }
    },
    __onMousedown(e) {
      this.__fakeFocus();
      this.mousedownEventListeners.forEach(listener => listener());
      this.__raise();
    },
    __onContextMenu(e) {
      this.$refs.contextmenu.show(e.clientX, e.clientY);
    },
    __onClose() {
      // 由于关闭时用了transform，系统菜单定位会出问题，先关闭菜单，再关闭窗口
      setTimeout(() => {
        this.close();
      }, 0);
      1
    },
    __onMove() {
      style.sheet.insertRule(`*{cursor: move !important}`, 0);
      this.moveModeFlag = true;
      window.addEventListener("mousedown", this.__moveModeThenDown);
    },
    __moveModeMove(e) {
      this.x += e.movementX;
      this.y += e.movementY;
    },
    __moveModeUp() {
      window.removeEventListener("mousedown", this.__moveModeThenDown);
      this.moveModeFlag = false;
      // bug
      style.sheet.deleteRule(0);
      window.removeEventListener("mousemove", this.__moveModeMove);
      window.removeEventListener("mouseup", this.__moveModeUp);
    },
    __moveModeThenDown(e) {
      if (!isParent(e.target, this.$el, true) || e.button != 0) {
        window.removeEventListener("mousedown", this.__moveModeThenDown);
        this.moveModeFlag = false;
        // bug
        style.sheet.deleteRule(0);
      }
      else {
        window.addEventListener("mousemove", this.__moveModeMove);
        window.addEventListener("mouseup", this.__moveModeUp);
      }
    },
    __fakeBlur() {
      this.fakeFocusFlag = false;
    },

    //窗口移动，控制框内部实现
    //bug: 在快速或者长时间move事件中有一些误差，以后可能会修
    __top(e, el) {
      e.preventDefault();
      if (this.height == 51 && e.clientY > this.y) {
        return;
      }
      this.y += e.movementY;
      this.height -= e.movementY;
      if (this.height < 51) {
        this.y = this.y - (51 - this.height);
        this.height = 51;
      }
    },
    __left(e, el) {
      e.preventDefault();
      if (this.width == 400 && e.clientX > this.x) {
        return;
      }
      this.x += e.movementX;
      this.width -= e.movementX;
      if (this.posMode == "right") {
        this.$emit("rightMode", this.width);
      }
      if (this.width < 400) {
        this.x = this.x - (400 - this.width);
        this.width = 400;
      }
    },
    __bottom(e, el) {
      e.preventDefault();
      if (this.height == 51 && e.clientY < this.y + 51) {
        return;
      }
      this.height += e.movementY;
      if (this.height < 51) {
        this.height = 51;
      }
    },
    __right(e, el) {
      e.preventDefault();
      if (this.width == 400 && e.clientX < this.x + 400) {
        return;
      }
      this.width += e.movementX;
      if (this.posMode == "left") {
        this.$emit("leftMode", this.width);
      }
      if (this.width < 400) {
        this.width = 400;
      }
    },
    __leftTop(e, el) {
      this.__left(e, el);
      this.__top(e, el);
    },
    __leftBottom(e, el) {
      this.__left(e, el);
      this.__bottom(e, el);
    },
    __rightTop(e, el) {
      this.__right(e, el);
      this.__top(e, el);
    },
    __rightBottom(e, el) {
      this.__right(e, el);
      this.__bottom(e, el);
    },
    //在标题栏触发此操作
    __move(e, el) {
      if (this.moveModeFlag == true) {
        return;
      }
      e.preventDefault();
      //最大化时点击标题栏拖动窗口化
      if (this.wndState == "max" || this.wndState == "maxH") {
        //增加用户容错率
        if ((e.movementX) ** 2 + (e.movementY) ** 2 <= 2) return;
        this.wndState = "window";
        this.y = 1;
        const rate = e.offsetX / (this.$el.offsetWidth - 16 - this.$refs.titleBtns.offsetWidth);
        const lw = rate * (this.width - this.$refs.titleBtns.offsetWidth);
        this.x = e.offsetX - lw;
      }
      //窗口左右填充
      //   if (this.x <= 5 && this.x >= 0 && e.movementX < 0) {
      //     this.posMode = "left"
      //     this.x = 0;
      //     this.$emit("left", true);
      //   }
      //   else if (this.x + this.width >= DesktopIns.ins.$el.offsetWidth - 5 && this.x + this.width <= DesktopIns.ins.$el.offsetWidth && e.movementX > 0) {
      //     this.posMode = "right";
      //     this.x = DesktopIns.ins.$el.offsetWidth - this.width;
      //     this.$emit("right", true);
      //   }
      //   else if (this.posMode == "left" && (this.x < -10 || this.x > 10)) {
      //     this.$emit("left", false);
      //     this.posMode = undefined;
      //   }
      //   else if (this.posMode == "right"
      //     && (this.x + this.width < DesktopIns.ins.$el.offsetWidth - 10 || this.x + this.width > DesktopIns.ins.$el.offsetWidth + 10)) {
      //     console.log(false);
      //     this.$emit("right", false);
      //     this.posMode = undefined;
      //   }
      this.x += e.movementX;
      this.y += e.movementY;
    },
    __up() {
      if (this.posMode == "left") {
        this.$emit("beLeft", this);
        this.wndState = "maxH";
      }
      else if (this.posMode == "right") {
        this.$emit("beRight", this);
        this.wndState = "maxH";
      }
    },
    //窗口状态内部实现
    __toggle() {
      if (this.wndState == "max") this.windowing();
      else if (this.wndState == "window") this.maximize();
    },
    __backFromMin() {
      if (this.preWndState == "window") {
        this.windowing();
      }
      else if (this.preWndState == "max") {
        this.maximize();
      }
    },
    __backFromFullscreen() {
      if (this.preWndState = "window") {
        this.windowing();
        desktop.taskbar.hidden = false;
      }
      else if (this.preWndState == "max") {
        this.maximize();
        desktop.taskbar.hidden = false;
      }
    },
    // 当子元素获得焦点，窗口失去焦点，称为伪焦点，用于模仿窗口焦点样式，此时键盘事件是冒泡传上来的
    __fakeFocus() {
      this.fakeFocusFlag = true;
    },
    __focus() {
      //由于点击任务时也会让窗口失焦，因此放到异步队列延后执行
      setTimeout(() => {
        this.$refs.wnd.focus({ preventScroll: true });
      }, 0);
    },

    // getTask(wndId) {
    //   return this.$parent.getTask(wndId);
    // },
    // open(app, wndObj, taskObj) {
    //   return DesktopIns.ins.openReturn(app, wndObj, taskObj);
    // },
    // bug: 缩放动画有些奇怪
    // maxHimize() {
    //   this.wndState = "maxH";
    // },
    trigger(isActive) {
      //最小化和活跃状态切换
      if (this.wndState == "min") {
        this.raise();
        if (this.preWndState == "max") this.maximize();
        else if (this.preWndState == "maxH") this.maxHimize();
        else if (this.preWndState == "window") this.windowing();
      }
      else if (this.wndState == "window" || this.wndState == "max") {
        this.minimize();
      }
    },

    //=================PUBLIC=================

    //窗口实例交流 
    // sendMessage(wndId, message) {
    //   this.$emit("message", wndId, message);
    // },
    // receiveMessage(message) {
    //   this.app.receiveMessage(message);
    // },


    raise() {

    },

    //窗口状态
    setWindowState(state) {
      if (state == "max") {
        this.maximize();
      }
      else if (state == "min") {
        this.minimize();
      }
      else if (state == "window") {
        tihs.windowing();
      }
    },
    getWindowState() {
      return this.wndState;
    },
    maximize() {
      if (this.wndState == "min") {
        let task = this.task ? this.task.$el.getBoundingClientRect() : { x: 0, y: window.innerHeight };
        let wnd = this.$el.getBoundingClientRect();
        const rate = 1 - Math.sqrt((task.x - wnd.x) ** 2 + (task.y - wnd.y) ** 2) / 1300 * 0.5;
        this.$el.style.transform = `translate(${(task.x - this.x - 20 - this.width / 2) * rate}px,${(task.y - this.y - this.height / 2) * rate}px) scale(0.5)`;
        this.$el.style.opacity = 0;
        //this.$el.offsetWidth;
        setTimeout(() => {
          this.$el.style.transition = "all 0.3s";
          this.$el.style.transform = "";
          this.$el.style.opacity = "";
        }, 0);
        setTimeout(() => {
          this.$el.style.transition = "";
        }, 300)
      }
      this.wndState = "max";
    },
    minimize(animeFlag = true) {
      if (this.wndState != "min") {
        this.preWndState = this.wndState;
      }
      if (animeFlag) {
        let task = this.task ? this.task.$el.getBoundingClientRect() : { x: 0, y: window.innerHeight };
        let wnd = this.$el.getBoundingClientRect();
        const rate = 1 - Math.sqrt((task.x - wnd.x) ** 2 + (task.y - wnd.y) ** 2) / 1300 * 0.5;
        this.$el.style.transform = `translate(${(task.x - this.x - 20 - this.width / 2) * rate}px,${(task.y - this.y - this.height / 2) * rate}px) scale(0.5)`;
        this.$el.style.opacity = 0;
        this.$el.style.transition = "all 0.3s";
        //不用那么准，就不用动画函数了
        setTimeout(() => {
          this.$el.style.transform = "";
          this.$el.style.opacity = "";
          this.$el.style.transition = "";
          this.wndState = "min";
        }, 300);
      }
      else {
        this.wndState = "min";
      }
    },
    windowing() {
      if (this.wndState == "min") {
        let task = this.task ? this.task.$el.getBoundingClientRect() : { x: 0, y: window.innerHeight };
        let wnd = this.$el.getBoundingClientRect();
        const rate = 1 - Math.sqrt((task.x - wnd.x) ** 2 + (task.y - wnd.y) ** 2) / 1300 * 0.5;
        this.$el.style.transform = `translate(${(task.x - this.x - 20 - this.width / 2) * rate}px,${(task.y - this.y - this.height / 2) * rate}px) scale(0.5)`;
        this.$el.style.opacity = 0;
        //this.$el.offsetWidth;
        setTimeout(() => {
          this.$el.style.transition = "all 0.3s";
          this.$el.style.transform = "";
          this.$el.style.opacity = "";
        }, 0);
        setTimeout(() => {
          this.$el.style.transition = "";
        }, 300)
      }
      this.wndState = "window";
    },
    fullscreening() {
      if (this.windowFullscreenableFlag == false) return;
      this.preWndState = this.wndState;
      this.wndState = "fullscreen";
      state.taskbar.hidden = true;
    },
    //future：任务栏相关，还没写
    setTaskIcon(icon) {
      this.$emit("taskbarIcon", { id: this.wnd.id, icon });
    },
    setTaskTitle(title) {

    },
    //标题栏相关
    setTitle(title) {
      this.title = title;
    },
    getTitle() {
      return this.title;
    },
    setIcon(icon) {
      this.icon = icon;
    },
    getIcon() {
      return this.icon;
    },
    //大小相关
    setW(w) {
      this.width = w;
    },
    getW() {
      return this.width;
    },
    setH(h) {
      this.height = h;
    },
    getH() {
      return this.height;
    },
    resize(w, h) {
      this.width = w;
      this.height = h;
    },
    //位置相关
    setX(x) {
      this.x = x;
    },
    getX() {
      return this.x;
    },
    setY(y) {
      this.y = y;
    },
    getY() {
      return this.y;
    },
    setPosition(x, y) {
      this.x = x;
      this.y = y;
    },
    getPosition() {
      return {
        x: this.x,
        y: this.y,
      }
    },
    //窗口显示相关
    setVisible(flag) {
      this.visibleFlag = flag;
      this.visibleEventListeners.forEach(listener => listener(flag, 0));
      //现在还不需要动画事件搞得那么准
      setTimeout(() => {
        this.visibleEventListeners.forEach(listener => listener(flag, 1));
      }, 250);
    },
    getVisible() {
      return this.visibleFlag;
    },
    close() {
      if (this.visibleFlag == false) {
        //没有动画，直接销毁
        this.destroyListeners.forEach(listener => listener());
        this.__destroy();
      }
      else {
        this.setVisible(false);
        //动画结束后销毁
        setTimeout(() => {
          this.destroyEventListeners.forEach(listener => listener());
          this.__destroy();
        }, 260);
      }
    },
    //窗口风格相关
    setWindowFlag() {

    },
    //各种模态框
    imgPicker() {
      this.__fakeBlur();
      return this.registerModal(ImgPicker, this.$refs.modals);
    },
    //事件监听器
    addDestroyEventListener(listener) {
      this.destroyEventListeners.push(listener);
    },
    addVisibleEventListener(listener) {
      this.visibleEventListeners.push(listener);
    },
    addMousedownEventListener(listener) {
      this.mousedownEventListeners.push(listener);
    }
  },

  created() {
    if (this.task) {
      this.task.addClickEventListener(this.__onTaskClick);
      this.task.__close = () => {
        this.close();
      }
    }
  },
  mounted() {
    window.addEventListener("mousedown", (e) => {
      if (!isParent(e.target, this.$el)) {
        this.__fakeBlur();
      }
    });
  },
  unmounted() {
    window.removeEventListener("mousedown", this.__fakeBlur);
  },
}
</script>

<style scoped>
.tea_window {
  position: absolute;
  outline: none;
}
.window-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.window-left_top {
  position: absolute;
  left: 0;
  top: 0;
  width: 8px;
  height: 8px;
  cursor: nw-resize;
}
.window-left_bottom {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 8px;
  height: 8px;
  cursor: sw-resize;
}
.window-right_top {
  position: absolute;
  right: 0;
  top: 0;
  width: 8px;
  height: 8px;
  cursor: ne-resize;
}
.window_right-bottom {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 8px;
  height: 8px;
  cursor: se-resize;
}
.window-top {
  position: absolute;
  width: calc(100% - 16px);
  height: 8px;
  top: 0;
  left: 8px;
  cursor: n-resize;
}
.window-left {
  position: absolute;
  width: 8px;
  height: calc(100% - 16px);
  left: 0;
  top: 8px;
  cursor: w-resize;
}
.window-bottom {
  position: absolute;
  width: calc(100% - 16px);
  height: 8px;
  left: 8px;
  bottom: 0;
  cursor: s-resize;
}
.window-right {
  position: absolute;
  width: 8px;
  height: calc(100% - 16px);
  right: 0;
  top: 8px;
  cursor: e-resize;
}
.window-inner {
  position: absolute;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}
.window-titlebar {
  position: absolute;
  width: 100%;
  height: 35px;
  background-color: #7f7d7c;
  user-select: none;
}
.window-titlebar--fakefocus {
  background-color: #4c4a48;
  /* color:pink; */
}
.tea_window:focus .window-titlebar {
  background-color: #4c4a48;
  /* color: red; */
}
.titlebar-content {
  display: inline-flex;
  align-items: center;
  height: 35px;
}
.titlebar-icon {
  padding-left: 10px;
  width: 20px;
}
.titlebar-title {
  margin-left: 5px;
}
.titlebar-btns {
  float: right;
  height: 35px;
}
.btn {
  width: 30px;
  height: 35px;
  display: inline-block;
}
.btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.btn svg {
  stroke: white;
  stroke-width: 1;
  fill: none;
  shape-rendering: crispEdges;
}
.window-client {
  position: absolute;
  width: 100%;
  left: 0;
  /* background-color: #a0c6e8; */
}

.show-enter-active,
.show-leave-active {
  transition-property: transform, opacity;
  transition-duration: 0.25s;
}
.show-enter-from {
  transform: scale(0.7);
  opacity: 0.4;
}
.show-leave-to {
  transform: scale(0.7);
  opacity: 0;
}
</style>