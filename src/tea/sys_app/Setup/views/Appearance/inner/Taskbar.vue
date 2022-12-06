<template>
  <div class="taskbar">

    <div class="tea_setup-section">
      <div>任务栏位置</div>
      <Dropdown 
        :data="['靠左','靠右','靠上','靠下']" 
        :default="mapReverse[desktop.taskbar.pos]"
        :width="150"
        :tr="tr"
        :node="node"
        @selected="v=>desktop.taskbar.pos=v" />
    </div>

    <div class="tea_setup-section">
      <div>任务栏隐藏</div>
      <Switch v-model="desktop.taskbar.hidden" true="开" false="关" />
    </div>

  </div>
</template>

<script>
import { Dropdown, Switch } from "cn";

import { desktop } from "tea/config";

const map = {
  '靠左': 'left',
  '靠右': 'right',
  '靠上': 'top',
  '靠下': 'bottom'
}

const mapReverse = {
  'left': '靠左',
  'right': '靠右',
  'top': '靠上',
  'bottom': '靠下',
}

export default {

  components: {
    Dropdown, Switch,
  },

  setup() {
    return {
      desktop,
      mapReverse,
    }
  },

  data() {
    return {
      node: undefined,
    }
  },

  methods: {
    tr(s) {
      return map[s];
    }
  },

  mounted() {
    this.node = this.$el;
  }

}
</script>


<style scoped>

</style>