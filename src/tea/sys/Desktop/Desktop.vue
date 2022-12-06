<template>
    <div 
      class="tea_desktop"
      :class="`tea_desktop--${desktop.taskbar.pos}`">
        <DesktopClient />
        <Taskbar />
    </div>
</template>

<script>
import { DesktopClient } from "tea/sys/DesktopClient";
import { Taskbar } from "tea/sys/Taskbar";
import { desktop } from "tea/config";

export default {
  components: {
    DesktopClient,
    Taskbar,
  },

  setup() {
    return {
      desktop,
    }
  }
}
</script>

<style>
.tea_desktop {
  height: 100vh;
  display: flex;
}
.tea_desktop--left {
  flex-direction: row-reverse;
}
.tea_desktop--right {
  flex-direction: row;
}
.tea_desktop--bottom {
  flex-direction: column;
}
.tea_desktop--top {
  flex-direction: column-reverse;
}
</style>