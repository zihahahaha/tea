<template>
    <div class="tea_menubar">
        <slot />
    </div>
</template>

<script>
// Mixins
import menuMixin from "../../mixin/menu-mixin.js";

// Utils
import { isParent } from "@/__utils/dom.js";


export default {

  name: "tea-menubar",

  mixins: [menuMixin],

  data() {
    return {
      //不触发模式和触发模式
      mode: false,
      preMenu: undefined,
    }
  },

  methods: {
    setMode(flag) {
      this.mode = flag;
      if (flag == true) {
        //点击非menu可以解除触发模式
        const f = (e) => {
          if (!isParent(e.target, this.$el)) {
            this.mode = false;
            this.menus.forEach(menu => menu.setVisible(false));
            window.removeEventListener("mousedown", f);
          }
        }
        window.addEventListener("mousedown", f);
      }
    },
    getMode() {
      return this.mode;
    }
  }
}
</script>

<style>
.tea_menubar {
  display: flex;
  background-color: #fff;
}
</style>