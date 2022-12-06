<template>
  <div class="desktop">
      
    <div class="tea_setup-section">
      <div>背景</div>
      <Dropdown 
        :data="['纯色','图片']"
        :default="defaultBgc"
        :width="200"
        :tr="m_bgcTr"
        :node="node"
        @selected="(type)=>desktop.desktopClient.bgc.type=type" />
      <div 
        v-if="desktop.desktopClient.bgc.type=='color'"
        class="color">
        <Button>选择颜色</Button>
      </div>
      <div 
        v-if="desktop.desktopClient.bgc.type=='img'"
        class="img">
        <Button @click="__onImgPicker">选择图片</Button>
      </div>
    </div>

    <div 
      class="tea_setup-section" 
      v-if="desktop.desktopClient.bgc.type=='img'">
      <div>图片尺寸&位置</div>
      <Dropdown 
        :data="['填充','适应','拉伸','自定义']"
        :default="defaultImg"
        :width="200"
        :tr="m_imgTr"
        :node="node"
        @selected="__onImgBgc" />
      <Input 
        v-if="desktop.desktopClient.bgc.sizeAndPosition.type=='custom'" 
        pre="background-size"
        :default="desktop.desktopClient.bgc.sizeAndPosition.backgroundSize"
        @value="(value)=>desktop.desktopClient.bgc.sizeAndPosition.backgroundSize=value" />
      <Input 
        v-if="desktop.desktopClient.bgc.sizeAndPosition.type=='custom'"
        pre="background-position"
        :default="desktop.desktopClient.bgc.sizeAndPosition.backgroundPosition"
        @value="(value)=>desktop.desktopClient.bgc.sizeAndPosition.backgroundPosition=value" />
    </div>

  </div>
</template>


<script>
import { Dropdown, Button, Input } from "cn";

import { desktop } from "tea/config";




const bgcMap = {
  "纯色": "color",
  "图片": "img",
};

const bgcMapReverse = {
  "color": "纯色",
  "img": "图片",
};

const imgBgcMap = {
  "填充": {
    type: "default",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  "适应": {
    type: "default",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
  "拉伸": {
    type: "default",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
  },
  "自定义": "custom",
}

export default {
  components: {
    Dropdown,
    Button,
    Input,
  },

  setup() {
    function m_bgcTr(s) {
      return bgcMap[s];
    }
    function m_imgTr(s) {
      return imgBgcMap[s];
    }
    return {
      desktop,
      bgcMapReverse,
      m_bgcTr,
      m_imgTr,
    }
  },

  data() {
    return {
      node: undefined,
    }
  },

  computed: {
    defaultBgc() {
      return bgcMapReverse[desktop.desktopClient.bgc.type];
    },
    defaultImg() {
      if (desktop.desktopClient.bgc.sizeAndPosition.type == "default") {
        if (desktop.desktopClient.bgc.sizeAndPosition.backgroundSize == "cover" && desktop.desktopClient.bgc.sizeAndPosition.backgroundPosition == "center") {
          return "填充";
        }
        else if (desktop.desktopClient.bgc.sizeAndPosition.backgroundSize == "contain" && desktop.desktopClient.bgc.sizeAndPosition.backgroundPosition == "center") {
          return "适应";
        }
        else if (desktop.desktopClient.bgc.sizeAndPosition.backgroundSize == "100% 100%" && desktop.desktopClient.bgc.sizeAndPosition.backgroundPosition == "center") {
          return "拉伸";
        }
        else return "自定义";
      }
    },
  },

  methods: {
    __onImgPicker() {
      this.$root.imgPicker().exec({}, (img) => {
        desktop.desktopClient.bgc.data = img;
      });
    },
    __onImgBgc(obj) {
      if (obj == "custom") {
        desktop.desktopClient.bgc.sizeAndPosition.type = "custom";
        return;
      }
      for (let i in obj) {
        desktop.desktopClient.bgc.sizeAndPosition[i] = obj[i];
      }
    }
  },

  mounted() {
    this.node = this.$el;
  }
}
</script>

<style scoped>
.desktop {
  height: 100%;
  overflow: auto;
}
.title {
  font-size: 20px;
}
</style>