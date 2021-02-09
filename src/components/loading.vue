<template>
  <div class="loading">
    <div class="text">
      <div class="fade" />
      <p>
        加载中
      </p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {createApp} from 'vue'

const Loading = {
  name: 'toast',
  data() {
    return {
      visible: true,
      text: '1'
    }
  },
}

export default Loading
let instanceCache;
// 创建节点
let root = document.createElement('div')
root.setAttribute('id', 'my')
// 监测主题颜色变化
function wathTheme () {
  let app = document.body.querySelector('#app')
  let theme = app.getAttribute('data-theme') === 'light'? 'light': 'dark'
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark')
  } else {
    root.setAttribute('data-theme', 'light')
  }
}
// 挂载节点
function mountComponent() {
  if (!instanceCache) {
    wathTheme()

    instanceCache = createApp(Loading)
    document.body.appendChild(root);
    instanceCache.mount('#my')
  }
}

export const loading = function () {
  mountComponent()
}
// 卸载节点
loading.close = function () {
  instanceCache.unmount(root);
  document.body.removeChild(root);
  instanceCache = ''
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.text
  position: fixed
  top 50%
  left 50%
  transform translate3d(-50%, -50%, 0)
  width 6.5rem
  height 6.5rem
  bgColor(dialog_background)
  opacity 0.7
  border-radius 0.5rem
  fontColor(dialog_font_color)
  display flex
  flex-direction column
  justify-content center
  align-items center
.fade
  animation: spinner 1s linear infinite;
  border: 5px solid transparent;
  border-top: solid 5px $color-theme;
  border-radius: 100%;
  width: 2rem;
  height: 2rem;
  opacity 1
  margin-bottom 10px
.loading::before
  content ''
  opacity 0.7
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  width: 100%
  height 100%
  bgColor(dialog_masking)

@keyframes spinner
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)
</style>