<template>
    <div 
      :draggable="data == undefined ? false : true"
      class="tea-shortcut"
      :class="{'tea-shortcut--hidden':tlHidden}"
      :style="{
        
      }"
      @dblclick="open"
      @drop.stop>
      <img class="tea-shortcut_icon"
        draggable="false"
        :src="data.shortcutIcon"/>
      <div class="tea-shortcut_title">{{ data.shortcutTitle }}</div>
    </div>
</template>

<script>

// 'position':pos == undefined ? '':'absolute',
//         'left':`${pos.x * 96}px`,
//         'top':`${pos.y * 109}px`,

import { searchApp } from "tea/registry";
export default {

  name: "tea-shortcut",

  emits: ["open"],

  props: {
    tlHidden: {
      type: Boolean,
      default: false,
    },
    //shortcut:{shortIcon,shortTitle,app}
    data: Object,
  },

  methods: {
    open() {
      if (searchApp(this.data.id)) {
        this.$emit("open", this.data.id);
      }
      else {
        console.log(`此快捷方式指向已删除的应用,应用id:${this.data.id}`);
      }
    }
  },

}
</script>

<style scoped>
.tea-shortcut {
  width: 60px;
  max-height: 95px;
  padding: 0 11px;
  margin: 7px;
  user-select: none;
  transition-property: padding;
  transition-duration: 0.3s;
  overflow: hidden;
  contain: paint;
}
.tea-shortcut--hidden {
  padding: 0;
}
.tea-shortcut:hover {
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}
.tea-shortcut_icon {
  display: block;
  width: 100%;
  height: 60px;
  object-fit: contain;
}
.tea-shortcut_title {
  box-sizing: border-box;
  transition-property: height, opacity;
  transition-duration: 0.3s;
  height: 35px;
  text-align: center;
  color: white;
  padding: 3px;
  text-shadow: 0 0 5px black;
}
.tea-shortcut--hidden .tea-shortcut_title {
  padding: 0;
  height: 0;
  opacity: 0;
}
</style>