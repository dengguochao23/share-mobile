<template>
  <div class="switch">
    <p>深色</p>
    <my-switch v-model="change" />
    <p>浅色</p>
  </div>
</template>

<script type="text/ecmascript-6">
import {Switch } from 'vant'
import { ref, watch } from 'vue'
export default {
  components: {
    MySwitch: Switch
  },
  setup(){
    const change = ref(true)
    watch(change, () => {
      let app = document.querySelector('#app')
      let dataTheme = app.getAttribute('data-theme') ==='light'?'dark':'light'
      app.setAttribute('data-theme', dataTheme)
    })
    return {
      change
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.switch
  display flex
  width :100%
  justify-content center
  align-items center
  p
    margin: 0 10px
    fontColor(font_color_main)
</style>