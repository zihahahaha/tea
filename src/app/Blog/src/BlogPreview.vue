<template>
    <div class="app-blog_preview" 
      v-html="txt" />
</template>

<script>
export default {

  name: "blog-preview",

  data() {
    return {
      txt: "",
    }
  },
  methods: {
    receiveMessage(message) {
      this.txt = message;
    }
  }
}
</script>

<style scoped>
.app-blog_preview {
  background-color: #eee;
  height: 100%;
  overflow: auto;
}
</style>