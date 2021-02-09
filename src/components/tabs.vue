<template>
  <div
    ref="root"
    class="tabs"
  >
    <div
      v-for="(item,index) in tabs"
      :key="index"
      class="tab"
      @click="select(index)"
    >
      <span>{{ item.label }}</span>
    </div>
    <div class="active" />
  </div>
</template>

<script type="text/ecmascript-6">
const CHANGE_EVENT = 'change'
import {onMounted, ref, watch} from 'vue'
export default {
  props: {
    tabs: {
      type: Array,
      default () {
        return [{
          label: '标题1',
          value: '1'
        },
          {
            label: '标题2',
            value: '2'
          },
          {
            label: '标题3',
            value: '3'
          }]
      }
    }
  },
  setup () {
    const root = ref(null)
    const itemOffsetLeft = []
    const current = ref(0)
    onMounted (()=>{
      computedOffsetLeft()
      defineActive()
    })
    function computedOffsetLeft () {
      const items = root.value.children
      for (let i = 0;i<items.length-1;i++){
        const item = items[i]
        let span = item.children
        itemOffsetLeft.push(span[0].offsetLeft)
      }
    }
    function defineActive () {
      const active = root.value.children[root.value.children.length - 1]
      active.style.transform = `translate3d(${itemOffsetLeft[0]}px,0,0)`
    }
    function translateActive (currentIndex) {
      const active =root.value.children[root.value.children.length - 1]
      active.style.transition = 'all 0.5s'
      active.style.transform = `translate3d(${itemOffsetLeft[currentIndex]}px,0,0)`
    }
    function select (index) {
      current.value = index
    }
    watch(current, (newVal) => {
      translateActive(newVal)
    })
    return {
      root,
      select,
      current
    }
  },
  watch: {
    current(newValue) {
      this.$emit(CHANGE_EVENT, this.tabs[newValue])
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.tabs
  box-sizing content-box
  width : 100%;
  height :3rem;
  display :flex;
  justify-content :space-around;
  align-items :center;
  background-color: $color-theme
  position: relative;
  .tab
    color #ffffff
    transform translateX()
  .active
    position absolute
    bottom 0px
    width 32px
    height 4px
    left 0
    background-color: #ffffff
</style>