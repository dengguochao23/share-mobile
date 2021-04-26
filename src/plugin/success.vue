<template>
  <div class="success">
    <div class="text">
      <div class="check" />
      <p>
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const INTERVAL = 3500
const DEFAULT = '成功'
import {createApp} from 'vue'

const Success = {
  name: 'success',
  inject: ['text']
}
export default Success
let instanceCache;
// 创建节点
let root = document.createElement('div')
root.setAttribute('id', 'my')
// 监测主题颜色变化
function watchTheme () {
  let app = document.body.querySelector('#app')
  let theme = app.getAttribute('data-theme') === 'light'? 'light': 'dark'
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
    instanceCache = createApp(Success) // 构建应用上下文的应用实例
    let text = arg[0]?arg[0]:DEFAULT
    instanceCache.provide('text', text) // 外部注入到组件的值
    document.body.appendChild(root); // 本根节点添加到body
    instanceCache.mount('#my') // 挂载组件
  }
}

export const success = function () {
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
.success
  animation success 0.3s linear
.success::before
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
.check
  position: relative;
  display: inline-block;
  width: 25px;
  height: 25px;
  background: $color-theme;
  border-radius: 25px;
  margin 10px 0
.check::after
  content: "";
  position: absolute;
  left: 5px;
  top: 8px;
  width: 50%;
  height: 25%;
  border: 2px solid #ffffff;
  border-radius: 1px;
  border-top: none;
  border-right: none;
  background: transparent;
  transform: rotate(-45deg);

@keyframes success
  0%
    opacity: 0
  100%
    opacity: 1
</style>