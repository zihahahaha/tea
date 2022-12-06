<template>
    <div class="tea_imgpicker" @click="onClick">
      <div class="line" ref="line0">
        <div         
          v-for="img in img0" 
          class="img"
          @click="__onClick(img)">
          <img :src="img">
        </div>
      </div>
      <div class="line" ref="line1">
        <div         
          v-for="img in img1" 
          class="img"
          @click="__onClick(img)">
          <img :src="img">
        </div>
      </div>
      <div class="line" ref="line2">
        <div         
          v-for="img in img2" 
          class="img"
          @click="__onClick(img)">
          <img :src="img">
        </div>
      </div>
      <div class="line" ref="line3">
        <div         
          v-for="img in img3" 
          class="img"
          @click="__onClick(img)">
          <img :src="img">
        </div>
      </div>
    </div>
</template>

<script>
//  打包的时候修改

import imgs from "../../../../playground/img.config";
export default {
  data() {
    return {
      img0: [],
      img1: [],
      img2: [],
      img3: [],
    }
  },
  methods: {
    __push(img) {
      setTimeout(() => {
        let min = Number.MAX_VALUE;
        let minIndex = 0;
        for (let i = 0; i < 4; ++i) {
          if (this.$refs[`line${i}`].offsetHeight < min) {
            min = this.$refs[`line${i}`].offsetHeight;
            minIndex = i;
          }
        }
        this[`img${minIndex}`].push(img);
      }, 0)
    },
    __onClick(img) {
      if (this.$root.callback) {
        this.$root.callback(img);
      }
      this.$root.__destroy();
    }
  },
  mounted() {
    for (let i = 0; i < imgs.length; ++i) {
      this.__push(imgs[i]);
    }
  }
}
</script>

<style scoped>
.tea_imgpicker {
  display: flex;
  align-items: flex-start;
}
.line {
  width: 25%;
}
.img {
  position: relative;
}
.img img {
  width: 100%;
}
.img::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.img:hover::before {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>