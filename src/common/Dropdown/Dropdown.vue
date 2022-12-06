<template>
  <div 
    class="tea_dropdown"
    :style="{'width':`${width}px`}">
      <div 
        class="tea_dropdown-selected"
        @click="onClick">
          {{ data[selectIndex] }}
          <div class="tea_dropdown-svg">
            <svg width="30" height="30">
               <polyline points="9,11 15,17 21,11" />
            </svg>
          </div>
      </div>
      <transition>
        <div 
          v-if="flag"
          class="tea_dropdwon-dropdown"
          :style="{ 'top': `${ top }px`}">
          <div
            v-for="(i,index) in data" 
            class="tea_dropdwon-select"
              :class="index==selectIndex?'tea_dropdwon-select--active':''"
              @click="select(i,index)">
              {{ i }}
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
// Utils 
import { isParent } from "@/__utils/dom.js";

export default {
  name: "tea-dropdown",

  emits: ["selected"],

  props: {
    data: {
      type: Array,
      required: true,
    },
    default: String,
    node: undefined,
    tr: {
      type: Function,
      default: s => { return s }
    },
    width: Number,
  },

  data() {
    return {
      flag: false,
      selectIndex: undefined,
      top: undefined,
    }
  },

  methods: {
    index() {
      let index = this.selectIndex;
      const boxMine = this.$el.getBoundingClientRect();
      const boxElse = this.node ? this.node.getBoundingClientRect() : { y: 0, height: window.innerHeight };
      const y1 = boxElse.y - boxMine.y + 30 * index;
      const y2 = boxElse.y + boxElse.height - boxMine.y - 30 * (this.data.length - index);
      console.log(y2);
      if (y1 > 0) {
        index = 0;
      }
      else if (y1 < 0 && y2 < 0) {
        index = this.data.length - 1;
      }
      this.top = -30 * index;
    },
    select(s, index) {
      this.$emit("selected", this.tr(s));
      this.selectIndex = index;
      this.flag = false;
      window.removeEventListener("mousedown", this.f);
    },
    onClick() {
      this.flag = !this.flag;
      if (this.flag == true) {
        this.index();
        window.addEventListener("mousedown", this.f);
      }
    },
    f(e) {
      if (!isParent(e.target, this.$el)) {
        this.flag = false;
        window.removeEventListener("mousedown", this.f);
      }
    }
  },

  mounted() {
    this.selectIndex = this.data.findIndex(i => i == this.default);
    this.index();
  },
  unmounted() {
    window.removeEventListener("mousedown", this.f);
  }
}
</script>

<style>
.tea_dropdown {
  user-select: none;
  position: relative;
}
.tea_dropdown-selected {
  box-sizing: border-box;
  border: solid 2px #b5b5b5;
  height: 30px;
  line-height: 28px;
  position: relative;
  padding-left: 5px;
}
.tea_dropdown-selected:hover {
  border-color: gray;
}
.tea_dropdown-svg {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0;
  top: 0;
}
.tea_dropdown-svg svg {
  stroke: black;
  stroke-width: 2;
  fill: none;
}
.tea_dropdwon-dropdown {
  background-color: white;
  position: absolute;
  width: 100%;
  overflow: auto;
  max-height: 210px;
  z-index: 1;
  box-shadow: 1px 1px 8px rgb(0, 0, 0, 0.3);
}
.tea_dropdwon-select {
  padding-left: 5px;
  height: 30px;
  line-height: 28px;
  box-sizing: border-box;
  border: solid 1px transparent;
}
div.tea_dropdwon-select.tea_dropdwon-select--active {
  background-color: gray;
}
.tea_dropdwon-select:hover {
  background-color: #ccc;
}
</style>