<template>
  <div class="tea_nav_template">
    <div class="tea_nav_template-nav">

      <slot />

      <div class="tea_nav_template-title">{{ title }}</div>

      <Nav style="width:150px">
        <NavItem 
          v-for="i in navList"
          :text="i.title"
          @click="__onClick(i.component, i.title)" />
      </Nav>

    </div>

      <div class="tea_nav_template-view">

        <div class="tea_nav_template-view_title">{{ selectTitle }}</div>
        <div class="tea_nav_template-view_content">
          <component :is="component" />
        </div>

      </div>

  </div>

</template>

<script>
import { Nav, NavItem } from "cn";
import { markRaw } from '@vue/reactivity';

export default {
  components: {
    Nav, NavItem,
  },

  props: {
    title: String,
    navList: Array,
    default: {
      type: Number,
      default: 0,
    }
  },

  data() {
    return {
      component: markRaw(this.navList[this.default].component),
      selectTitle: this.navList[this.default].title,
    }
  },
  methods: {
    __onClick(component, title) {
      this.component = markRaw(component);
      this.selectTitle = title;
    }
  }
}
</script>

<style>
.tea_nav_template {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
  user-select: none;
}
.tea_nav_template-nav {
  display: flex;
  flex-direction: column;
  background-color: rgb(186, 190, 198, 0.85);
  backdrop-filter: blur(5px);
}
.tea_nav_template-title {
  font-size: 18px;
  font-weight: 700;
  margin: 5px 0;
  padding-left: 10px;
}
.tea_nav_template-view {
  flex: 1;
  background-color: white;
  position: relative;
  height: 100%;
  padding-left: 10px;
}
.tea_nav_template-view_title {
  height: 35px;
  line-height: 35px;
  font-size: 20px;
}
.tea_nav_template-view_content {
  height: calc(100% - 35px);
  position: relative;
}
</style>