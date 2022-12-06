<template>

  <div 
    class="tea_desktop_client" 
    :style="[
      bgcStyle,
      {
        'background-size':desktop.desktopClient.bgc.sizeAndPosition.backgroundSize,
        'background-position':desktop.desktopClient.bgc.sizeAndPosition.backgroundPosition,
      }
    ]"
    @contextmenu.prevent="contextmenu"
    @dragover.prevent
    @drop="__onDrop">

    <ContextMenu ref="contextmenu">
      <Action 
        title="设置" 
        @click="setupWnd" />
    </ContextMenu>
    
    <Shortcut
      v-for="(data, index) in shortcuts" 
      @dragstart="__onDragstart($event, index)"
      @open="open"
      :data="data" />
    
    <div class="wnds" ref="wnds"></div>

  </div>
    
</template>

<script>
//最后打包的时候还是要改一下

import { Shortcut, ShortcutGroup } from "./inner";
import { ContextMenu, Action } from "cn/Menus";
import { exports, shortcuts, desktop } from "tea/config";
//系统内置应用
import { Setup } from "tea/sys_app";

import { markRaw } from 'vue';

import { searchSystemApp, searchApp } from "tea/registry";


export default
  {

    setup() {
      return {
        shortcuts,
        desktop,
        Setup,
      }
    },

    name: "tea-desktop",

    emits: ["active", "close", "open"],

    components: {
      Shortcut, ShortcutGroup,
      ContextMenu, Action,
    },

    data() {
      return {
        wnds: markRaw([]),
        dragTarget: undefined,
      }
    },

    computed: {
      bgcStyle() {
        const styles = {};
        if (desktop.desktopClient.bgc.type == "img") {
          styles["background-image"] = `url(${desktop.desktopClient.bgc.data})`;
        }
        else if (desktop.desktopClient.bgc.type == "color") {
          styles["background-color"] = desktop.desktopClient.bgc.data;
        }
        return styles;
      }
    },

    created() {
      exports.desktopClient = this;
    },

    mounted() {
      //以后再写，桌面图标在视口resize不知道什么策略好
      // const desktopObserver = new ResizeObserver(() => {
      //   let x = Math.floor(this.$el.offsetWidth / 96);
      //   let y = Math.floor(this.$el.offsetHeight / 109);
      //   this.shPos.forEach(i => {

      //   });
      // });
      // desktopObserver.observe(this.$el);
    },

    methods: {
      __onDragstart(e, i) {
        this.dragTarget = {
          x: e.offsetX,
          y: e.offsetY,
          i,
        }
      },
      // bug:有概率会出错
      __onDrop(e) {
        let x = Math.round((e.clientX - this.$el.offsetLeft - this.dragTarget.x) / 96);
        let y = Math.round((e.clientY - this.$el.offsetTop - this.dragTarget.y) / 109);
        this.shPos[this.dragTarget.i].x = x;
        this.shPos[this.dragTarget.i].y = y;
      },

      contextmenu(e) {
        this.$refs.contextmenu.show(e.clientX, e.clientY);
      },
      setupWnd() {
        this.open("setup", true);
      },
      open(id, sysFlag) {
        let wnd;
        if (sysFlag) {
          wnd = searchSystemApp(id).createWnd({});
        }
        else {
          wnd = searchApp(id).createWnd({});
        }
        // let wnd = getApp(id).wndClass.createWnd({});
        if (wnd) {
          wnd.z = this.wnds.length + 1;
          this.wnds.forEach(i => {
            if (i.task) {
              i.task.__setActive(false);
            }
          });
          if (wnd.task) {
            wnd.task.__setActive(true);
          }
          wnd.addDestroyEventListener(() => {
            this.wnds.splice(this.wnds.indexOf(wnd), 1);
          });
          this.wnds.push(wnd);
          //改变z轴，或者活跃task
          wnd.__raise = (flag) => {
            let maxz = -1;
            this.wnds.forEach(i => {
              if (i.z > maxz) {
                maxz = i.z;
                i.z--;
              }
            });
            wnd.z = maxz;
            if (wnd.wndState == "min") wnd.__backFromMin();
            if (flag) {
              this.wnds.forEach(i => {
                if (i.task) {
                  i.task.__setActive(false);
                }
              });
              setTimeout(() => {
                wnd.task.__setActive(true);
              }, 0);
            }
          }
        }
      },
      showDesktop() {
        this.wnds.forEach(wnd => {
          wnd.minimize(false);
          wnd.task.__setActive(false);
        });
      }
    },
  }
</script>

<style scoped>
.tea_desktop_client {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: gray;
  overflow: hidden;
  /* display: grid;
  grid-template-rows: repeat(auto-fill, 109px);
  grid-template-columns: repeat(auto-fill, 96px); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.tea_desktop_client-mask_pos {
  position: absolute;
  width: 100%;
  height: 100%;
}
.mask_pos--left {
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(255, 255, 255, 0.5);
  height: 100%;
}
.mask_pos--right {
  position: absolute;
  top: 0;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
}
.wnds {
  width: 0;
  height: 0;
}
</style>