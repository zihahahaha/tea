<template>
    <NavTemplate
      title="外观" 
      :navList="customList">
      <MainBtn @click="$emit('mainpage')"/>
    </NavTemplate>
</template>

<script>
import { NavTemplate, MainBtn } from "../../component";
import { Desktop, Taskbar } from "./inner";

const customList = [
  {
    title: "桌面",
    component: Desktop,
  },
  {
    title: "任务栏",
    component: Taskbar,
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
