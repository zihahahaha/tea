<template>
    <div class="tea-demo">
      <img :src="img" alt="">
      <button @click="click">click</button>
    </div>
</template>

<script>

export default {

  name: "demo",

  data() {
    return {
      img: undefined,
    }
  },

  methods: {
    click() {
      this.$root.imgPicker().exec({}, (img) => {
        this.img = img;
      });
    }
  },

}
</script>

<style scoped>
.tea-demo {
  height: 100%;
  overflow: auto;
  background-color: white;
}
</style> 