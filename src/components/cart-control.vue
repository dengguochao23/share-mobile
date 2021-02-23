<template>
  <div class="cart-control-wrapper">
    <my-icon
      v-show="count > 0"
      color="#1B91F3"
      name="close"
      @click="reduce"
    />
    <p
      v-show="count > 0"
      class="num"
    >
      {{ count }}
    </p>
    <my-icon
      color="#1B91F3"
      name="add-o"
      @click="add"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import {Icon} from 'vant'
import {toRefs} from 'vue'
const ADD_EVENT = 'add'
const REDUCE_EVENT = 'reduce'
export default {
  components: {
    MyIcon: Icon
  },
  props: {
    count: {
      type: [Number, String],
      default() {
        return 0
      }
    },
    max: {
      type: Number,
      default() {
        return 100000;
      }
    }
  },
  setup(props, _ref) {
    const {count, max} = toRefs(props)
    // const num = toRef(count)
    // const num = computed({
    //   get: () => count.value,
    //   set: val => {
    //     count.value = val
    //   }
    // })
    const emit = _ref.emit
    function reduce () {
      // num.value --
      emit(REDUCE_EVENT)
    }
    function add() {
      if (count.value === max.value) {
        return
      }
      // num.value ++
      emit(ADD_EVENT)
    }
    // watch(count, (newVal) => {
    //   // num.value = newVal
    // })

    return {
      add,
      // num,
      reduce
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.cart-control-wrapper
  width 5rem
  height 2rem
  display flex
  align-items center
  fontColor(font_color_main)

  .num
    margin 0px 10px
</style>