<template>
    <div class="application">

      <div class="tea_setup-section">
        <div 
          v-for="(id, index) in appList"
          class="app"
          :class="{ 'app--active': index == activeIndex }"
          :key="id"
          @click="__onClick(index)" >
          <div class="app_wrap">
            <img :src="appRegistry[id].wndClass.icon" alt="">
            <div class="app_title">{{ appRegistry[id].name }}</div>
          </div>
          <div class="app_btn" v-if="index == activeIndex">
            <Button style="position:absolute;right:0" @click="__onUninstall(id)">卸载</Button>
          </div>
        </div>
      </div>
      
    </div>
</template>

<script>
import { Button } from "cn";
import { uninstallApp, appRegistry } from "tea/registry";
export default {
  components: {
    Button,
  },
  setup() {
    return {
      appRegistry,
    }
  },
  data() {
    return {
      activeIndex: undefined,
    }
  },
  computed: {
    appList() {
      return Object.keys(this.appRegistry);
    }
  },
  methods: {
    __onClick(index) {
      this.activeIndex = index;
    },
    __onUninstall(id) {
      uninstallApp(id);
    }
  }
}
</script>

<style scoped>
.applist {
  padding-left: 10px;
}
.app:hover {
  background-color: rgb(230, 230, 230);
}
.app--active {
  background-color: rgb(230, 230, 230);
}
.app_wrap {
  padding: 5px;
  display: flex;
  height: 35px;
}
.app_icon {
  width: 35px;
  height: 35px;
}
.app_title {
  height: 35px;
  line-height: 35px;
  margin-left: 20px;
}
.app_btn {
  position: relative;
  height: 35px;
  padding-top: 5px;
}
</style>