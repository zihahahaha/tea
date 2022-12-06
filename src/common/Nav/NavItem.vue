<template>
    <div class="list_item">{{text}}</div>
</template>

<script>
export default {
  props: {
    text: String,
  }
}
</script>

<style scoped>
.list_item {
  user-select: none;
  line-height: 30px;
  padding-left: 5px;
}
.list_item:hover {
  background-color: rgba(220, 220, 220, 0.5);
}
</style>