<template>

    <div 
      class="mask"
      @mousedown.stop="__onMousedown"
      @keydown.stop
      tabindex="0">

      <div class="tea-modal"
      @mousedown.stop
        :style="{ 
          'width':`${width}px`,
          'height':`${height}px`,
          'left':`${x}px`,
          'top':`${y}px` 
          }">

        <div 
          class="modal-titlebar"
          :class="{shining:shiningFlag}"
          v-move="{move}">

          <span class="titlebar-title">{{title}}</span>

          <div class="titlebar-btns"
          @mousedown.stop>

          <div class="btn"
            @click="__destroy">
            <svg width="30" height="35">
              <line x1="10" y1="13" x2="19" y2="22" style="stroke:rgb(255,255,255);stroke-width:1;" />
              <line x1="19" y1="13" x2="10" y2="22" style="stroke:rgb(255,255,255);stroke-width:1; width=30" />
            </svg>
          </div>

          </div>
        
        </div>

        <div class="modal-client">
          <MODALCLIENT />
        </div>

      </div>

    </div>

</template>

<script>
//不考虑嵌套的模态框，只是简单的设计
import { move } from "tea/__directive/cursor.js";
export default {

  name: "tea-modal",

  directives: {
    move
  },

  data() {
    return {
      title: "hello",
      x: 20,
      y: 30,
      width: 500,
      height: 400,
      callback: undefined,
      shiningFlag: false,
    }
  },

  methods: {
    setCallback(callback) {
      this.callback = callback;
    },
    move(e, el) {
      this.x += e.movementX;
      this.y += e.movementY;
    },
    __onMousedown() {
      this.shiningFlag = true;
      setTimeout(() => {
        this.shiningFlag = false;
      }, 1000);
    }
  },
}
</script>


<style scoped>
.mask {
  position: absolute;
  /* left: -8px;
  right: -8px;
  top: -43px;
  bottom: -8px; */
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  outline: none;
}
.tea-modal {
  position: absolute;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  z-index: 1;
}
.modal-titlebar {
  position: absolute;
  left: 0;
  top: 0;
  height: 35px;
  width: 100%;
  background-color: #4c4a48;
  user-select: none;
}
.shining {
  animation: shining 0.25s steps(1) infinite;
}
.titlebar-title {
  line-height: 35px;
}
.titlebar-btns {
  float: right;
}
.btn {
  width: 30px;
  height: 35px;
  display: inline-block;
}
.btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.modal-client {
  position: absolute;
  top: 35px;
  overflow: auto;
  width: 100%;
  height: calc(100% - 35px);
  background-color: #a0c6e8;
}
@keyframes shining {
  0% {
    filter: invert(0);
  }
  50% {
    filter: invert(1);
  }
}
</style>