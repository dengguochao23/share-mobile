<template>
  <div class="notFound">
    <div class="notFound-wrapper">
      <p>404...</p>
    </div>
    <p
      class="but"
      @click="back"
    >
      回到首页
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'NotFound',
  methods: {
    back() {
      this.$router.push('/').catch(err => err)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.notFound
  position: fixed;
  top 0
  left 0
  right 0
  bottom 0
  bgColor(background_color_minor)
  .notFound-wrapper
    width 60%
    height 100px
    position absolute
    top 50%
    left 50%
    border-bottom 5px solid $color-theme
    transform translate3d(-50%, -50%, 0)
    p
      font-size 5rem
      text-align center
  .but
    position: absolute;
    bottom 30%
    left 50%
    font-size 1.2rem
    font-weight 700
    transform translate3d(-50%, 0 ,0)
    cursor pointer
</style>