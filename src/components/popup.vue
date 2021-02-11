<template>
  <transition
    @before-enter="beforeShow"
    @enter="showTo"
    @leave="closeTo"
  >
    <div
      v-if="show"
      ref="listGroup"
      class="popup-wrapper"
    >
      <slot />
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {toRef} from 'vue'
const DURATION = 0.5
const TRANSITIONEND_EVENT = 'transitionend'
export default {
  components: {
  },
  props: {
    modelValue: {
      type: Boolean,
      default () {
        return false
      }
    },
    bottom: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  emits: ['update:modelValue',TRANSITIONEND_EVENT],
  setup (props) {
    const show = toRef(props, 'modelValue')
    return {
      show,
    }
  },
  methods: {
    onClose () {
      this.$emit('update:modelValue', false)
    },
    onClick () {
      this.$refs.scroll.refresh()
    },
    beforeShow(el){
      el.style.transform = `translate3d(0px,${this.bottom}px, 0)`
    },
    showTo(el, done) {
      let target = - (this.$refs.listGroup.offsetHeight + this.bottom)
      this._reflow = document.body.offsetHeight // 重新计算小球高度
      el.style.transform = `translate3d(0px,${target}px,0)`
      el.style.transition = `all ${DURATION}s`
      el.addEventListener(TRANSITIONEND_EVENT, done)
      this.$emit(TRANSITIONEND_EVENT)
    },
    closeTo (el,done) {
      this._reflow = document.body.offsetHeight // 重新计算小球高度
      el.style.transform = `translate3d(0px,${this.bottom}px, 0)`
      el.style.transition = `all ${DURATION}s`
      el.addEventListener(TRANSITIONEND_EVENT, done)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.popup-wrapper
  width 100%
  position fixed
  left 0
  bgColor(background_color_minor)
  top 100%
</style>