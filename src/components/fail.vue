<template>
  <div class="fail">
    <div class="text">
      <span class="mark">!</span>
      <p>
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const DEFAULT = '失败'
const INTERVAL = 1500
import {createApp} from 'vue'

const Fail = {
  name: 'fail',
  inject: ['text']
}
export default Fail
let instanceCache;
// 创建节点
let root = document.createElement('div')
root.setAttribute('id', 'my')

// 监测主题颜色变化
function watchTheme() {
  let app = document.body.querySelector('#app')
  let theme = app.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark')
  } else {
    root.setAttribute('data-theme', 'light')
  }
}

// 挂载节点
function mountComponent(arg) {
  if (!instanceCache) {
    watchTheme()
    instanceCache = createApp(Fail)
    let text = arg[0] ? arg[0] : DEFAULT
    instanceCache.provide('text', text)
    document.body.appendChild(root);
    instanceCache.mount('#my')
  }
}

export const fail = function () {
  let arg = arguments
  mountComponent(arg)
  setTimeout(() => {
    instanceCache.unmount(root);
    document.body.removeChild(root);
    instanceCache = ''
  }, INTERVAL)
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.fail
  animation fail 0.3s linear

.fail::before
  content ''
  opacity 0.7
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  width 100%
  height 100%
  bgColor(dialog_masking)

.text
  position: fixed
  top 50%
  left 50%
  transform translate3d(-50%, -50%, 0)
  bgColor(dialog_background)
  opacity 0.7
  max-width 280px
  border-radius 0.5rem
  fontColor(dialog_font_color)
  display flex
  flex-direction column
  justify-content center
  align-items center
  padding 20px
.mark
  font-size $font-size-large-xx
  margin 10px 0
  font-weight 700

@keyframes fail
  0%
    opacity: 0
  100%
    opacity: 1
</style>