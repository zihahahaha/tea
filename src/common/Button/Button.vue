<template>
    <button class="tea_button">
        <slot />
    </button>
</template>

<style>
.tea_button {
  display: inline-block;
  border: solid 2px transparent;
  padding: 0 20px;
  font-size: 16px;
  user-select: none;
  background-color: #ccc;
}
.tea_button:hover {
  border-color: gray;
}
</style>