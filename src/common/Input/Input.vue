<template>
    <div class="tea_input">
      <span>{{ pre }}: </span><input type="text" @blur="$emit('value',value)" v-model="value">
    </div>
</template>

<script>
export default {
  emits: ["value"],
  props: {
    pre: String,
    default: String
  },
  data() {
    return {
      value: this.default,
    }
  }
}
</script>

<style>
.tea_input {
  line-height: 28px;
}
.tea_input input {
  outline: none;
  border: solid 1px black;
  padding-left: 5px;
  box-sizing: border-box;
  line-height: 28px;
  position: relative;
}
</style>