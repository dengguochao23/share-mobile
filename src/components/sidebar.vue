<template>
  <div>
    <div class="slidebar-wrapper">
      <div
        v-for="(name,index) in title"
        :key="index"
        class="item"
        @click="select(index)"
      >
        <span v-show="active === index" />
        <p>{{ name }}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const CHANGE_EVENT = 'change'
import {ref} from 'vue'
export default {
  props: {
    title: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup () {
    const active = ref(0)
    function select (id) {
      active.value = id
    }
    return {
      select,
      active
    }
  },
  watch: {
    active (newVal) {
      this.$emit(CHANGE_EVENT, {'name': this.title[newVal],'id': newVal})
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.slidebar-wrapper
  width 100%
  min-height 1px
  display flex
  flex-direction column
  .item
    height 3rem
    line-height 3rem
    bgColor(background_color_minor)
    fontColor(font_color_main)
    position relative
    span
      width 5px
      height 3rem
      background-color: $color-theme
      position absolute
      left 0
      top 0
   p
     margin-left 10px

</style>