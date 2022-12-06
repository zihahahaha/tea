<template>
    <div class="item">
        <slot />
        <div class="title-wrap">
            <div class="title">{{ title }}</div>
            <div class="description">{{ description }}</div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
  }
}
</script>

<style scoped>
.item {
  user-select: none;
  display: flex;
  border: solid 1px transparent;
  padding: 15px 0 0 5px;
}
.item:hover {
  border: solid 1px gray;
}
.title-wrap  {
  margin-left: 5px;
}
</style>