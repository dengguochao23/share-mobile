<template>
  <div class="nothing-wrapper">
    <span>没有更多内容</span>
  </div>
</template>

<script type="text/ecmascript-6">
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.nothing-wrapper
  width 100%
  bgColor(background_color_main)
  position relative
  height 100%
  span
    font-size $font-size-large
    fontColor(font_color_main)
    position absolute
    top 50%
    left 50%
    text-align center
    transform translate3d(-50%, -50%, 0)
</style>