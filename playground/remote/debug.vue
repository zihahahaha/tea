<template>
  <Desktop />
</template>

<script>
import { Desktop } from "tea/sys/Desktop";

export default {
  components: {
    Desktop,
  },
  mounted() {
    document.title = "远端应用测试";
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#tea {
  overflow: hidden;
}
</style>

