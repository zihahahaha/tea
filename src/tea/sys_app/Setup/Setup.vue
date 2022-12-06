<template>
    <div class="tea_setup">
      <Transition name="view">  
        <div class="tea_setup-grid" v-if="component == undefined">
          <Item title="外观" description="桌面，任务栏" @click="__onClick(Appearance)">
            <svg width="45" height="45">
              <use xlink:href="#icon-appearance" width="45" height="45" />
            </svg>
          </Item>
          <Item title="应用" description="应用设置" @click="__onClick(Application)">
            <svg width="45" height="45">
              <use xlink:href="#icon-app" width="45" height="45" />
            </svg>
          </Item>
        </div>
        <component :is="component" @mainpage="mainPage" v-else/>
      </Transition>
    </div>
</template>

<script>
import { markRaw } from '@vue/reactivity';
import { Appearance, Application } from "./views";
import { Item } from "./component";
export default {
  components: {
    Appearance,
    Application,
    Item,
  },
  setup() {
    return {
      Appearance: markRaw(Appearance),
      Application: markRaw(Application),
    }
  },
  data() {
    return {
      component: undefined,
    }
  },
  created() {
    this.$root.setTitle("设置");
    this.$root.setIcon("setupicon.png");
    this.$root.task.setTitle("设置");
    this.$root.task.setIcon("setupicon.png");
  },
  methods: {
    __onClick(component) {
      this.component = component;
    },
    mainPage() {
      this.component = undefined;
    }
  },
}
</script>

<style scoped>
.view-enter-active {
  transition: transform 0.25s;
  box-shadow: 0 0 0 50px white;
}
.view-enter-from {
  transform: scale(0.98);
}
</style>

<style>
.tea_setup {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.tea_setup-section {
  margin: 25px;
  margin-left: 0;
}
.tea_setup-section:first-child {
  margin-top: 0px;
}
.tea_setup-section > * {
  margin: 5px 0;
}
.tea_setup-grid {
  position: absolute;
  box-sizing: border-box;
  display: grid;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: white;
  padding-top: 10px;
  grid-template-rows: repeat(auto-fill, 80px);
  grid-template-columns: repeat(auto-fill, 200px);
  gap: 15px;
  justify-content: center;
  overflow: auto;
}
</style>