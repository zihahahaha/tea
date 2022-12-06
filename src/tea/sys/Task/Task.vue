<template>
    <div 
      v-show="visibleFlag"
      class="tea_task"
      :class="{
        'tea_task--active': activeFlag,
        'tea_task--dragover': dragOverFlag,
        }"
      draggable="true"
      @click="__onClick"
      @contextmenu.prevent="__onContextMenu">

      <img class="tea_task-icon"
        draggable="false" 
        :src="icon" />
      <div class="tea_task-title">{{ title }}</div>  

      <ContextMenu ref="contextmenu">
        <Action 
          title="关闭窗口"
          @click.stop="__onClose" />
      </ContextMenu>

    </div>
</template>

<script>
import { ContextMenu, Action } from "cn/Menus";
export default {
  components: {
    ContextMenu, Action,
  },
  props: {
    //icon:任务图标，title:任务标题,wndId:窗口ID
    task: {
      type: Object,
      default: {},
    }
  },

  data() {
    return {
      icon: undefined,
      title: undefined,
      visibleFlag: true,
      activeFlag: false,
      dragOverFlag: false,
      destroyEventListeners: [],
      clickEventListeners: [],
    }
  },

  methods: {
    __setActive(flag) {
      this.activeFlag = flag;
    },
    __onClick() {
      this.clickEventListeners.forEach(listener => listener(this.activeFlag));
      this.__taskbar();
    },
    __onContextMenu(e) {
      this.$refs.contextmenu.show(e.clientX, e.clientY);
    },
    __onClose() {
      this.__close();
    },
    setVisible(flag) {
      this.visibleFlag = flag;
      return this;
    },
    getVisible() {
      return this.visibleFlag;
    },
    setTitle(title) {
      this.title = title;
      return this;
    },
    getTitle() {
      return this.title;
    },
    setIcon(icon) {
      this.icon = icon;
      return this;
    },
    getIcon() {
      return this.icon;
    },
    close() {
      this.destroyEventListeners.forEach(listener => listener());
      this.__destroy();
    },
    addDestroyEventListener(listener) {
      this.destroyEventListeners.push(listener);
    },
    addClickEventListener(listener) {
      this.clickEventListeners.push(listener);
    }
  }

}
</script>

.<style scoped>
.tea_task {
  width: 100%;
  max-width: 100px;
  height: 30px;
  user-select: none;
  display: flex;
}
.tea_task:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.tea_task--active {
  background-color: rgba(255, 255, 255, 0.1);
}
.tea_task--dragover {
  background-color: rgba(237, 121, 19, 0.5);
}
.tea_task-icon {
  box-sizing: border-box;
  padding: 2px;
  width: 25px;
  height: 30px;
  object-fit: contain;
  overflow: hidden;
}
.tea_task-title {
  display: inline-block;
  color: white;
  line-height: 30px;
  margin-left: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10px;
}
</style>