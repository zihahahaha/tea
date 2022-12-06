<template>
    <div class="tea_menu"
      :class="[`tea_menu--${type}`,{ 'tea_menu--active': activeState }]"
      @mouseenter="onEnter"
      @mouseleave="onLeave">

      <div class="tea_menu-title"
        :style="menuCss"
        @click="onClick">
        <div class="tea_menu-title_text">{{ title }}</div>
        <svg class="tea_menu-rightarrow" 
          width="20" 
          height="20">
          <polyline points="5,5 10,10 5,15"  style="fill:none;stroke:black;stroke-width:1"/>
        </svg>
      </div>
        
      <div class="tea_menu-actions"
        :style="{ 'display': activeState?'block':'' }">
        <slot />
      </div>

    </div>
</template>

<script>
// Mixins 
import menuMixin from "../../mixin/menu-mixin.js";

export default {

  name: "tea-menu",

  mixins: [menuMixin],

  props: {
    title: String,
    //backgroundColor:背景颜色,textColor:文字颜色
    basicStyle: Object,
    hoverStyle: Object,
    activeStyle: Object,
  },

  created() {
    if (this.$parent.$options.name == "tea-menu") this.type = "sub";
    else if (this.$parent.$options.name == "tea-menubar") this.type = "sup";
  },

  data() {
    return {
      //sup | sub
      type: "sup",
      activeState: false,
      hoverState: false,
    }
  },

  methods: {
    //自下而上的关闭menu
    cancel() {
      if (this.type == "sub") {
        this.activeState = false;
        this.$parent.cancel();
      }
      else if (this.type == "sup") {
        this.activeState = false;
        this.$parent.setMode(false);
      }
    },
    //自上而下的关闭menu
    setVisible(flag) {
      this.activeState = flag;
      if (flag == false) {
        this.menus.forEach(menu => menu.setVisible(false));
      }
    },
    onClick() {
      //sub menu绑定了不必要的click监听器，以后可能改
      if (this.type == "sub") return;
      else if (this.type == "sup") {
        this.$parent.setMode(!this.activeState);
        this.activeState = !this.activeState;
      }
    },
    onEnter() {
      this.hoverState = true;
      if (this.type == "sup" && this.activeState == false && this.$parent.getMode()) {
        this.activeState = true;
        this.$parent.enter(this);
      }
      else if (this.type == "sub") {
        this.activeState = true;
        this.$parent.enter(this);
      }
    },
    onLeave() {
      this.hoverState = false;
      //不用管mode，一致处理就行
      this.$parent.menuLeave(this);
    },
  },

  computed: {
    menuCss() {
      let styles;
      if (this.hoverState) {
        if (this.type == "sup")
          styles = { ...this.basicCss, ...this.hoverCss };
        else if (this.type == "sub")
          styles = { ...this.basicCss, ...this.activeCss };
      }
      else if (this.activeState) {
        styles = { ...this.basicCss, ...this.activeCss };
      }
      else {
        styles = this.basicCss;
      }
      return styles;
    },
    basicCss() {
      const styles = {};

      if (this.basicStyle) {
        styles["color"] = this.basicStyle.textColor;
        styles["background-color"] = this.basicStyle.backgroundColor;
      }

      return styles;
    },
    hoverCss() {
      const styles = {};

      if (this.hoverStyle) {
        styles["color"] = this.hoverStyle.textColor;
        styles["background-color"] = this.hoverStyle.backgroundColor;
      }

      return styles;
    },
    activeCss() {
      const styles = {};

      if (this.activeStyle) {
        styles["color"] = this.activeStyle.textColor;
        styles["background-color"] = this.activeStyle.backgroundColor;
      }

      return styles;
    },
  },

}
</script>

<style>
.tea_menu {
  position: relative;
  user-select: none;
}
.tea_menu-title {
  padding: 0 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tea_menu--sup > .tea_menu-title {
  background-color: #fff;
}
.tea_menu--sup > .tea_menu-title:hover {
  background-color: #eee;
}
.tea_menu--sup.tea_menu--active > .tea_menu-title {
  background-color: #e2e2e2;
}
.tea_menu--sub > .tea_menu-title {
  background-color: #fff;
  padding: 5px 0 5px 17px;
}
.tea_menu--sub > .tea_menu-title:hover {
  background-color: #eaeaea;
}
.tea_menu--sub.tea_menu--active > .tea_menu-title {
  background-color: #eaeaea;
}
.tea_menu--sub .tea_menu-title_text {
  box-sizing: border-box;
  flex-shrink: 0;
  min-width: 120px;
  max-width: 220px;
  padding-right: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tea_menu--sup > .tea_menu-title .tea_menu-rightarrow {
  display: none;
}
.tea_menu-actions {
  position: absolute;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  display: none;
}
.tea_menu--sup > .tea_menu-actions {
  left: 0;
  top: 100%;
}
.tea_menu--sub > .tea_menu-actions {
  left: 100%;
  top: -5px;
}
</style>