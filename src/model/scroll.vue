<template>
  <div
    ref="scroll"
    class="scroll"
  >
    <div>
      <slot />
      <div
        v-if="none"
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
import {toRef, watch} from 'vue'
export default {
  props: {
    page: {
      type: Number,
      default () {
        return 0
      }
    },
    pages: {
      type: Number,
      default () {
        return 0
      }
    },
    data: {
      default () {
        return {}
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
  data () {
    return {
      bs: '',
      none: false
    }
  },
  setup(props){
    const data = toRef(props, 'data')
    watch(data.value, (newV) => {
      console.log(newV)
    })
  },
  watch: {
    // 用于判断是否滚动到底部显示没有更多数据，以及刷新数据
    page (currentPage) {
      if (currentPage >= this.pages) {
        this.none = true
      } else {
        this.none = false
      }
      setTimeout(() => {
        this.refresh()
        if (this.pullUpLoad) {
          this.finishPullUp()
        }
      }, this.refreshDelay)
    },
    // 用于判断是否滚动到底部显示没有更多数据
    pages(total){
      if (this.page >= total){
        this.none = true
      } else {
        this.none = false
      }
    },
    // 单纯用于刷新
    data () {
      setTimeout(() => {
        console.log('fresh')
        this.refresh()
        if (this.pullUpLoad) {
          this.finishPullUp()
        }
      }, this.refreshDelay)
    }
  },
  mounted() {
    setTimeout(()=>{
      this._init()
    },50)
  },
  methods: {
    _init() {
      this.bs = new BetterScroll(this.$refs.scroll, {
        scrollY: this.scrollY,
        scrollX: this.scrollX,
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
        bounce: {
          top: this.bounceTop,
          bottom: true,
          left: true,
          right: true
        }
      })
      if (this.pullUpLoad) {
        this._initPullup()
        // this._initScrollEnd()
      }
      if (this.probeType === 3) {
        this._initOnscroll()
      }
    },
    // 下拉刷新后一定要执行这步
    finishPullUp() {
      this.bs && this.bs.finishPullUp()
    },
    scrollTo() {
      this.bs && this.bs.scrollTo.apply(this.bs, arguments)
    },
    scrollToElement() {
      this.bs && this.bs.scrollToElement.apply(this.bs, arguments)
    },
    // 下拉刷新
    _initPullup() {
      this.bs.on('pullingUp', () => {
        this.$emit(PULLUP_EVENT)
      })
    },
    // 监听滚动
    _initOnscroll() {
      this.bs.on('scroll', (pos) => {
        this.$emit(SCROLL_EVENT, pos)
      })
    },
    // 滚动到底部时间
    // _initScrollEnd() {
    //   this.bs.on('scrollEnd', () => {
    //     this.$emit('scrollEnd')
    //   })
    // },
    refresh(){
      this.bs && this.bs.refresh()
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