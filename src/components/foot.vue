<template>
  <div class="foot">
    <div
      v-for="(item,index) in foot"
      :key="item.index"
      class="item"
      :class="{active: index === idx}"
      @click="_router(item.name, index)"
    >
      <p>
        {{ item.title }}
      </p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Foo',
  data () {
    return {
      foot:[{
        title: '主页',
        name: '/'
      },{
        title: '足迹',
        name: 'drift'
      },{
        title: '我的',
        name: 'home'
      }],
      idx: 0
    }
  },
  methods: {
    _router(rule, key){
      this.$router.push(rule).catch(err => err)
      this.idx = key
    },
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl";
.foot
  position: fixed;
  bottom :0;
  left :0;
  width : 100%;
  height :3rem;
  display :flex;
  justify-content :space-around;
  align-items :center;
  bgColor(background_color_main);
  fontColor(font_color_main);
  .item
    font-size :1rem;
    font-weight :700;
    &.active
      color: $color-theme
</style>