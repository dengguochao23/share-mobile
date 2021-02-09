<template>
  <transition name="cover">
    <div
      v-if="show"
      class="cover-wrapper"
      @click.stop="closeCover"
    />
  </transition>
</template>

<script type="text/ecmascript-6">
import {toRef} from 'vue'
export default {
  props: {
    modelValue: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  setup (props) {
    const show = toRef(props, 'modelValue')
    return {
      show
    }
  },
  methods: {
    closeCover () {
      this.$emit('update:modelValue', false)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.cover-wrapper
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  background-color: #000000
  opacity 0.5
  &.cover-enter-from, &.cover-leave-to
    opacity 0

  &.cover-enter-active, &.cover-leave-active
    transition: all 0.8s
</style>