<template>
  <NavTemplate
    title="应用" 
    :navList="customList">
    <MainBtn @click="$emit('mainpage')" />
  </NavTemplate>
</template>

<script>
import { NavTemplate, MainBtn } from "../../component";
import { App } from "./inner";

const customList = [
  {
    title: "应用设置",
    component: App,
  }
];

export default {
  emits: ["mainpage"],
  components: {
    NavTemplate,
    MainBtn,
  },
  setup() {
    return {
      customList,
    }
  }
}
</script>