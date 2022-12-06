<template>
  <div class="tea_swicth">

    <div 
      class="tea_switch-btn"
      :class="{ 'tea_swicth-btn--true': modelValue }"
      @click="$emit('update:modelValue',!modelValue)">
      <div 
        class="tea_swicth-circle"
        :class="{ 'tea_swicth-circle--true': modelValue }" />
      </div>

    <div class="tea_swicth-message">{{ modelValue ? this.true : this.false }}</div>

  </div>
</template>

<script>
export default {
  emits: ["update:modelValue"],

  props: {
    modelValue: {
      require: true,
      type: Boolean,
    },
    true: String,
    false: String,
  }
}
</script>

<style>
.tea_swicth {
  display: flex;
}
.tea_switch-btn {
  box-sizing: border-box;
  display: inline-block;
  border-radius: 50px;
  height: 24px;
  width: 45px;
  position: relative;
  border: solid 2px gray;
  background-color: white;
  transition: all 0.25s;
}
.tea_switch-btn.tea_swicth-btn--true {
  background-color: gray;
}

.tea_swicth-circle {
  position: absolute;
  left: 1px;
  border-radius: 100%;
  height: 18px;
  top: 1px;
  aspect-ratio: 1 / 1;
  background-color: gray;
  transition: left 0.25s, transform 0.25s, background-color 0.25s;
}
.tea_swicth-circle.tea_swicth-circle--true {
  left: calc(100% - 1px);
  transform: translateX(-100%);
  background-color: white;
}
.tea_swicth-message {
  padding-top: 1.5px;
  margin-left: 15px;
}
</style>