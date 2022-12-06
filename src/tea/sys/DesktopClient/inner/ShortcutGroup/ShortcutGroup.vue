<template>
    <div 
      :draggable="data.x == undefined ? false : true"
      class="tea_group"
      :class="{'tea_group--active': active }"
      :style="{
        'position':data.x ? 'absolute':'',
        'left':`${data.x * 96}px`,
        'top':`${data.y * 109}px`,
      }"
      @click="active=true">

        <div class="tea_group_inner">
          <transition name="fade">
            <div v-if="active"
              class="tea_group_title_top">
              {{ data.groupTitle }}
            </div>
          </transition>
          <div class="tea_group-scroll_hidden">
             <div class="tea_group-scroll" ref="scroll">
               <Shortcut v-for="i in data.shortcuts"
                v-bind="$attrs"
                :data="i"
                :tlHidden="!active" />
          </div>
          </div>
        </div>
        <transition name="transform">
          <div v-if="!active" class="tea_group_title">{{ data.groupTitle }}</div>
        </transition>

    </div>
</template>

<script>
// Utils
import { isParent } from "@/__utils/dom.js";

// Componets
import Shortcut from "../Shortcut/Shortcut.vue";

export default {

  name: "tea-group",

  components: {
    Shortcut,
  },

  props: {
    data: Object,
  },

  data() {
    return {
      active: false,
    }
  },

  watch: {
    active: {
      handler(val) {
        if (val == false) {
          this.$refs.scroll.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  },

  mounted() {
    window.addEventListener("mousedown", (e) => {
      if (!isParent(e.target, this.$el)) {
        this.active = false;
      }
    })
  }
}
</script>

<style scoped>
.tea_group {
  position: relative;
  width: 60px;
  height: 95px;
  padding: 0 11px;
  margin: 7px;
  user-select: none;
}
.tea_group:hover {
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}
.tea_group--active.tea_group:hover {
  background-color: transparent;
  box-shadow: none;
}
.tea_group_inner {
  position: relative;
  z-index: 1;
  width: 148px;
  height: 148px;
  border: solid 1px #000;
  border-radius: 30px;
  transform: translate(-44px, -44px) scale(0.405);
  transition-property: width, height, border-radius, padding-top, transform;
  transition-duration: 0.3s;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
.tea_group--active .tea_group_inner {
  padding-top: 20px;
  width: 192px;
  height: 218px;
  transform: none;
}
.tea_group_inner::before {
  content: "";
  position: absolute;
  display: block;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  /* z-index: 1; */
}
.tea_group-scroll_hidden {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.tea_group-scroll {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: calc(100% + 20px);
  height: 100%;
  overflow: auto;
}
.tea_group--active .tea_group_inner::before {
  display: none;
}
.tea_group_title {
  box-sizing: border-box;
  padding: 3px;
  width: 60px;
  height: 35px;
  position: absolute;
  bottom: 0;
  overflow: hidden;
  text-align: center;
  color: white;
  text-shadow: 0 0 5px black;
}
.tea_group_title_top {
  position: absolute;
  top: -5px;
  left: 30px;
  width: 132px;
  height: 25px;
  /* z-index: 2; */
  background-color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  border-radius: 5px;
}
.fade-enter-active,
.fade-leave-active {
  transition-property: left, opacity;
  transition-duration: 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  left: 10px;
  opacity: 0;
}
.transform-enter-from,
.transform-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.transform-enter-active,
.transform-leave-active {
  transition-property: transform, opacity;
  transition-duration: 0.2s;
}
</style>