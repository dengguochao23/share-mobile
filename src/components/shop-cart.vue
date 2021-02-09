<template>
  <div class="shop-cart-wrapper">
    <div class="icon">
      <my-icon
        name="cart-o"
        :size="'40px'"
        color="#1989fa"
        badge="0"
      />
    </div>
    <p class="total">
      ￥ 多少元
    </p>
    <my-button
      type="primary"
      size="small"
      round
      block
      class="button"
    >
      撤销
    </my-button>
  </div>
</template>

<script type="text/ecmascript-6">
import {Icon, Button} from 'vant'
export default {
  components: {
    MyIcon: Icon,
    MyButton: Button
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.shop-cart-wrapper
  width 100%
  height 3rem
  bgColor(background_color_minor)
  border-top 3px solid $color-theme
  position relative
  .icon
    width 4rem
    height 4rem
    bgColor(background_color_main)
    border-radius 50%
    display flex
    justify-content center
    align-items center
    position absolute
    left 1rem
    bottom 10px
  .total
    position absolute
    left 6rem
    top 50%
    transform translateY(-50%)
  .button
    position absolute
    top 50%
    right 30px
    transform translateY(-50%)
    width 3rem
</style>