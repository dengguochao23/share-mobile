<template>
  <div
    ref="root"
    class="scroll"
  >
    <div>
      <slot />
      <div
        v-if="noMore"
        class="bottom"
      >
        没有更多的内容
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BetterScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
BetterScroll.use(Pullup)
const PULLUP_EVENT = 'pullingUp'
const SCROLL_EVENT = 'scroll'
import {toRefs, watch, onMounted, ref, reactive} from 'vue'
export default {
  props: {
    total: {
      type: Number,
      default () {
        return 10000
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    scrollY: {
      type: Boolean,
      default () {
        return true
      }
    },
    scrollX: {
      type: Boolean,
      default () {
        return false
      }
    },
    probeType: {
      type: Number,
      default() {
        return 0;
      }
    },
    pullUpLoad: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 当滚动超过边缘的时候会有一小段回弹动画
    // 我这里只设置向上的动画
    bounceTop: {
      type: Boolean,
      default () {
        return true
      }
    },
    // 刷新的时间
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  setup(props, _ref){
    const state = reactive({
      bs: ''
    })
    const root = ref(null)
    const noMore = ref(false)
    const emit = _ref.emit
    const {data, total} = toRefs(props)
    function _init() {
      state.bs = new BetterScroll(root.value, {
        scrollY: props.scrollY,
        scrollX: props.scrollX,
        click: true,
        probeType: props.probeType,
        pullUpLoad: props.pullUpLoad,
        bounce: {
          top: props.bounceTop,
          bottom: true,
          left: true,
          right: true
        }
      })
      if (props.pullUpLoad) {
        _initPullup()
        // this._initScrollEnd()
      }
      if (props.probeType === 3) {
        _initOnscroll()
      }
    }
    function _initPullup () {
      state.bs.on('pullingUp', () => {
        emit(PULLUP_EVENT)
      })
    }
    function _initOnscroll () {
      state.bs.on('scroll', (pos) => {
        emit(SCROLL_EVENT, pos)
      })
    }
    function showNone (data, total) {
      if (data.length >= total) {
        noMore.value = true
      }
    }
    onMounted(()=>{
      setTimeout(() =>{
        _init()
      }, 50)
    })
    watch(data.value, () => {
      setTimeout(()=>{
        state.bs.refresh()
        if(props.pullUpLoad) {
          state.bs.finishPullUp()
        }
      }, props.refreshDelay)
    })
    // 用于显示没有更多的内容
    watch(total, (newVal) => {
      showNone(data.value, newVal)
    })
    return {
      root,
      state,
      noMore
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 下拉刷新后一定要执行这步
    finishPullUp() {
      this.state.bs && this.state.bs.finishPullUp()
    },
    scrollTo() {
      this.state.bs && this.state.bs.scrollTo.apply(this.state.bs, arguments)
    },
    scrollToElement() {
      this.state.bs && this.state.bs.scrollToElement.apply(this.state.bs, arguments)
    },
    refresh(){
      this.state.bs && this.state.bs.refresh()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.bottom
  width 100%
  height 3rem
  text-align center
  line-height 3rem
  font-size 8px
</style>