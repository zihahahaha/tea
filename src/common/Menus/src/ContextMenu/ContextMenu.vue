<template>
    
    <div class="tea_contextmenu"
      :class="[`tea_contextmenu--${type}`,{ 'tea_contextmenu--active': activeState }]"
      :style="{ 
          'left': `${x}px`,
          'top': `${y}px`, 
          'transform': `translate(${tx},${ty})`,
        }"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @contextmenu.stop.prevent>

      <div class="tea_contextmenu-title"
        v-if="this.type == 'sub'"
        :style="menuCss">
        <div class="tea_contextmenu-title_text">{{ title }}</div>
        <svg class="tea_contextmenu-rightarrow" 
          width="20" 
          height="20">
          <polyline points="5,5 10,10 5,15"  style="fill:none;stroke:black;stroke-width:1"/>
        </svg>
      </div>

      <div class="tea_contextmenu-actions"
        :style="{ 
            display: activeState?'block':'none',
            top: top?`${top}px`:'',
            bottom: bottom?`${bottom}px`:'',
          }">
        <slot />
      </div>
        
    </div>

</template>

<script>
// Mixins
import menuMixin from "../../mixin/menu-mixin.js";

// Utils
import { isParent } from "@/__utils/dom.js";

export default {

  name: "tea-contextmenu",

  mixins: [menuMixin],

  emits: ["created", "canDestroy"],

  props: {
    title: String,
    //backgroundColor:背景颜色,textColor:文字颜色
    basicStyle: Object,
    activeStyle: Object,
    delay: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      //sup sub
      type: "sup",
      //contextMenu只有两个状态
      activeState: false,
      x: undefined,
      y: undefined,
      top: undefined,
      bottom: undefined,
      tx: 0,
      ty: 0,
    }
  },

  //bug:自适应写法些许不优美，以后可能改
  watch: {
    activeState: {
      handler(val) {
        if (val == true && this.type == "sub") {
          // console.log(this.title,this.$el);
          // console.log(this.$el.getBoundingClientRect().y);
          if (this.$el.getBoundingClientRect().y < window.innerHeight / 2) {
            console.log("a");
            this.top = -5;
            this.bottom = undefined;
          }
          else {
            this.top = undefined;
            this.bottom = 3;
          }
        }
      }
    }
  },

  computed: {
    menuCss() {
      let styles;
      if (this.activeState) {
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
    activeCss() {
      const styles = {};

      if (this.activeStyle) {
        styles["color"] = this.activeStyle.textColor;
        styles["background-color"] = this.activeStyle.backgroundColor;
      }

      return styles;
    },
  },

  created() {
    window.addEventListener("resize", () => {
      this.setVisible(false);
    });
    if (this.$parent.$options.name == "tea-contextmenu") {
      this.type = "sub";
    }
    else {
      this.type = "sup";
      this.$emit("created", this);
    }
  },

  methods: {
    //自下而上的关闭menu，供Action调用
    cancel() {
      if (this.type == "sub") {
        this.activeState = false;
        this.$parent.cancel();
      }
      else if (this.type == "sup") {
        this.activeState = false;
        this.$emit("canDestroy");
      }
    },
    //自上而下的关闭menu
    setVisible(flag) {
      this.activeState = flag;
      if (flag == false) {
        this.menus.forEach(menu => menu.setVisible(false));
      }
    },
    show(x, y, flag = false) {
      this.setVisible(true);
      if (flag == false) {
        if (x < window.innerWidth / 2) {
          this.tx = 0;
        }
        else {
          this.tx = "-100%";
        }
        if (y < window.innerHeight / 2) {
          this.ty = 0;
        }
        else {
          this.ty = "-100%";
        }
      }
      else {
        this.tx = 0;
        this.ty = 0;
      }
      this.x = x;
      this.y = y;
      //渲染出后才会添加mousedown监听器
      const f = (e) => {
        if (!isParent(e.target, this.$el)) {
          this.$emit("canDestroy");
          this.setVisible(false);
          window.removeEventListener("mousedown", f);
        }
      };
      window.addEventListener("mousedown", f);
    },
    onEnter() {
      if (this.type == "sup") return;
      else {
        this.activeState = true;
        this.$parent.enter(this);
      }
    },
    onLeave() {
      if (this.type == "sup") return;
      else {
        this.$parent.menuLeave(this);
      }
    }
  }

}
</script>

<style>
.tea_contextmenu {
  z-index: 1000;
  user-select: none;
}
.tea_contextmenu--sup {
  position: fixed;
}
.tea_contextmenu--active.tea_contextmenu--sub {
  position: relative;
}
.tea_contextmenu-title {
  box-sizing: border-box;
  padding: 5px 0 5px 17px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  min-width: 120px;
  max-width: 220px;
}
.tea_contextmenu--active > .tea_contextmenu-title {
  background-color: #eaeaea;
}
.tea_contextmenu--sub .tea_contextmenu-title_text {
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tea_contextmenu-actions {
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  border: solid 1px #a0a0a0;
}
.tea_contextmenu--sub > .tea_contextmenu-actions {
  position: absolute;
  left: calc(100% - 5px);
}
</style>