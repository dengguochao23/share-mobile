<template>
  <div
    class="head"
  >
    <my-icon
      name="arrow-left"
      size="32px"
      class="icon"
      color="white"
      @click="back"
    />
    <div class="text">
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {Icon } from 'vant'
const BACK_EVENT = 'back'
export default {
  components: {
    MyIcon: Icon
  },
  props: {
    title: {
      type: String,
      default () {
        return '标题'
      }
    }
  },
  methods: {
    back() {
      this.$emit(BACK_EVENT)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
  .head
    width 100%
    height 3rem
    position :relative
    background-color: $color-theme
    .icon
      width 3rem
      height 3rem
      position absolute
      left 0.3rem
      top 0
      line-height 3rem
    .text
      position absolute
      width 5rem
      height 3rem
      left 50%
      line-height 3rem
      transform translateX(-50%)
      right 0
      color white
      font-size $font-size-large
      text-align center
</style>