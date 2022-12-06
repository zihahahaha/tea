<template>
    <button>
        <svg width="15" height="35"><use width="15" height="35" y="-1" xlink:href="#icon-mainpage"/></svg>
        <div class="btn-title">主页</div>
    </button>
</template>

<style scoped>
button {
  padding-left: 5px;
  border: none;
  background-color: transparent;
  display: flex;
  height: 35px;
}
button:hover {
  background-color: rgba(220, 220, 220, 0.5);
}
.btn-title {
  height: 35px;
  line-height: 35px;
  margin-left: 10px;
}
</style>