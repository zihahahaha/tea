<template>
    <div 
      class="tea_taskbar"
      :class="`tea_taskbar--${ desktop.taskbar.pos }`"
      :style="{ display: desktop.taskbar.hidden ? 'none' : '' }">
    
      <div class="tea_taskbar-tasks" ref="tasks" />

      <button @click="__onDesktopBtn" class="tea_taskbar-desktopbtn" />

    </div>
</template>

<script>
import { registerTaskClass } from "tea/sys/Task";
import { exports, desktop } from "tea/config";
import { markRaw } from '@vue/reactivity';
import { isParent } from "@/__utils/dom.js";
let taskClass = {};

export default {
  name: "tea-taskbar",

  setup() {
    return {
      desktop,
    }
  },

  data() {
    return {
      tasks: markRaw([]),
    }
  },

  mounted() {
    exports.taskbar = this;
    taskClass = registerTaskClass(taskClass, this.$refs.tasks);
    window.addEventListener("mousedown", (e) => {
      //bug: 先这样 以后再改
      if (isParent(e.target, this.$el)) {
        return;
      }
      this.tasks.forEach(task => {
        task.__setActive(false);
      })
    })
  },

  methods: {
    __onDesktopBtn() {
      exports.desktopClient.showDesktop();
    },
    createTask() {
      const task = taskClass.createTask({});
      this.tasks.push(task);
      task.__taskbar = () => {
        this.tasks.forEach(i => i.__setActive(false));
        task.__setActive(true);
      }
      task.addDestroyEventListener(() => {
        this.tasks.splice(this.tasks.indexOf(task), 1);
      });
      return task;
    },
  }
}
</script>

<style>
.tea_taskbar {
  position: relative;
  background-color: #292d32;
  flex-shrink: 0;
  display: flex;
}
.tea_taskbar-tasks {
  flex: 1;
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.tea_taskbar-tasks > * {
  width: 100%;
  max-width: 100px;
}
.tea_taskbar--left,
.tea_taskbar--right {
  height: 100%;
  width: 60px;
  flex-direction: column;
}
.tea_taskbar--top,
.tea_taskbar--bottom {
  height: 30px;
  width: 100%;
  flex-direction: row;
}
.tea_taskbar--top .tea_taskbar-tasks,
.tea_taskbar--bottom .tea_taskbar-tasks {
  flex-direction: row;
  overflow-y: auto;
  height: 100%;
}

.tea_taskbar--left .tea_taskbar-tasks,
.tea_taskbar--right .tea_taskbar-tasks {
  flex-direction: column;
  overflow-x: auto;
  width: 100%;
}

.tea_taskbar-desktopbtn {
  border: none;
  outline: none;
  background-color: transparent;
}
.tea_taskbar--left .tea_taskbar-desktopbtn,
.tea_taskbar--right .tea_taskbar-desktopbtn {
  width: 100%;
  height: 5px;
  border-top: solid 1px white;
}
.tea_taskbar--top .tea_taskbar-desktopbtn,
.tea_taskbar--bottom .tea_taskbar-desktopbtn {
  height: 100%;
  width: 8px;
  border-left: solid 1px white;
}
.tea_taskbar-desktopbtn:hover {
  background-color: gray;
}
</style>