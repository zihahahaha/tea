<template>
    <div class="tea_action"
      @click="onClick"
      @mouseenter="$parent.enter()">
      {{ title }}
    </div>
</template>

<script>
export default {

  props: {
    title: String
  },

  methods: {
    //关闭父菜单,由于是一级一级传的，设计上嵌套太深性能很差，以后可能改
    onClick() {
      this.$parent.cancel();
    }
  }

}
</script>

<style>
.tea_action {
  box-sizing: border-box;
  background-color: #fff;
  padding: 5px 50px 5px 17px;
  min-width: 120px;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tea_action:hover {
  background-color: #eaeaea;
}
</style>