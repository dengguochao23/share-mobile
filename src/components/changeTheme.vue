<template>
  <div class="switch">
    <p>浅色</p>
    <my-switch v-model="checked" />
    <p>深色</p>
  </div>
</template>

<script type="text/ecmascript-6">
import {Switch } from 'vant'
import { ref, watch, onMounted } from 'vue'
import {useStore} from "vuex";
// 在这里我并没有采用缓存来存储深黑模式的切换状态，改为vuex来存储
export default {
  components: {
    MySwitch: Switch
  },
  setup(){
    const store = useStore()
    const checked = ref(store.getters.darkMode)
    function initTheme () {
      let mode = store.getters.darkMode
      let media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      // 为true 是 深色模式（深夜模式）
      if (mode === '') {
        if(media){
          checked.value = true
        }else {
          checked.value = false
        }
      }
    }
    function changeTheme (state) {
      let app = document.querySelector('#app')
      app.setAttribute('data-theme', state)
      if (state === 'dark') {
        store.commit('DARKMODE', true)
      }
      if (state === 'light') {
        store.commit('DARKMODE', false)
      }
    }
    // initTheme()
    onMounted(()=>{
      initTheme()
    })
    watch(checked, (newVal) => {
      if (newVal) {
        changeTheme('dark')
      } else {
        changeTheme('light')
      }
    })
    return {
      checked
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