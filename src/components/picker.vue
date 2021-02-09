<template>
  <div
    class="picker"
    @touchmove.prevent
    @click="_cancel"
  >
    <div
      class="picker-panel"
      @click.stop
    >
      <div class="picker-choose border-bottom-1px">
        <span
          class="cancel"
          @click="_cancel"
        >取消</span>
        <span
          class="confirm"
          @click="_confirm"
        >确定</span>
        <h1 class="picker-title">
          {{ title }}
        </h1>
      </div>
      <div class="picker-content">
        <div class="mask-top border-bottom-1px" />
        <div class="mask-bottom border-top-1px" />
        <div
          ref="wheelWrapper"
          class="wheel-wrapper"
        >
          <div
            ref="wheel"
            class="wheel"
          >
            <ul class="wheel-scroll">
              <li
                v-for="(item, index) in pickerList.column1"
                :key="index"
                class="wheel-item"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>
          <div
            v-if="pickerList.column2.length > 0"
            ref="wheel"
            class="wheel"
          >
            <ul class="wheel-scroll">
              <li
                v-for="(item, index) in pickerList.column2"
                :key="index"
                class="wheel-item"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="picker-footer" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const EVENT_CONFIRM = 'confirm'
const EVENT_CANCEL = 'cancel'
const BACKTORIGHT = 200  // 回正的时间
const ROTATE = 25  // 字体的角度
import BetterScroll from '@better-scroll/core'
import {ref, onMounted, reactive, watch, toRef} from 'vue'

export default {
  props: {
    title: {
      type: String,
      default () {
        return 'Title'
      }
    },
    pickerData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  setup(props) {
    const wheel = []
    let timer = ''
    const itemHeight = ref(0)
    const currentIndex = reactive({
      0: 0,
      1: 0
    })
    const pickerList = reactive({
      column1: [],
      column2: []
    })
    const column1 = toRef(currentIndex, 0)
    const _init = async () => {
      await _handelPickerColumn1(props.pickerData)
      await _handelPickerColumn2(props.pickerData, 0)
      const wheelWrapper = document.querySelectorAll('.wheel-wrapper')[0]
      await _createWheel(wheelWrapper)
      await _computedItemHeight()
      await _computedBoundary()
      await _initScroll()
      await _initScrollEnd()
    }
    const _createWheel = (wheelWrapper) => {
      const w = wheelWrapper.children
      for (let i = 0; i < w.length; i++) {
        wheel[i] = new BetterScroll(w[i], {
          useTransition: false,
          probeType: 3,
        })
      }
    }
    // 计算每个item的高度
    const _computedItemHeight = () => {
      const ul = document.querySelectorAll('.wheel-scroll')[0]
      const li = ul.children[0].clientHeight
      itemHeight.value = li
    }
    // 重新设置滚动的距离
    const _computedBoundary = () => {
      const ws = wheel
      ws.forEach((w, i) => {
        const hooks = w.scroller.scrollBehaviorY.hooks
        // 主列表
        if (i === 0) {
          hooks.on('computeBoundary', (boundary) => {
            let itemLength = pickerList.column1.length - 1
            boundary.minScrollPos = 0 // 上边界最大值，正的越多，下拉的幅度越大
            boundary.maxScrollPos = -(itemLength * itemHeight.value) // 下边界最小值，负的越多，滚的越远
          })
        }
        // 副列表
        if (i === 1) {
          if (pickerList.column2.length === 0) {
            return
          }
          hooks.on('computeBoundary', (boundary) => {
            let itemLength = pickerList.column2.length - 1
            boundary.minScrollPos = 0 // 上边界最大值，正的越多，下拉的幅度越大
            boundary.maxScrollPos = -(itemLength * itemHeight.value) // 下边界最小值，负的越多，滚的越远
          })
        }
      })
    }
    const _refresh = () => {
      wheel.forEach((w) => {
        w.refresh()
      })
    }
    const _initScroll = () => {
      let wr = wheel
      wr.forEach((w, i) => {
        w.on('scroll', (pos) => {
          let y = pos.y
          _rotateX(y, i)
          currentIndex[i] = _findNearestValidWheel(w, y)
        })
      })
    }
    const _initScrollEnd = () => {
      let wr = wheel
      wr.forEach((w, i) => {
        w.on('scrollEnd', () => {
          _rightToRightWheel(w, i, currentIndex[i])
        })
      })
    }
    const _rotateX = (y, index) => {
      const ul = document.querySelectorAll('.wheel-scroll')
      let liColllect = ul[index].children
      for (let j = 0; j < liColllect.length; j++) {
        let deg = ROTATE * (y / itemHeight.value + j)
        let safeDeg = deg.toFixed(3)
        liColllect[j].style.transform = `rotateX(${safeDeg}deg)`
      }
    }
    // 让节点滚到正确的位置
    const _rightToRightWheel = (w, i, current) => {
      const ul = document.querySelectorAll('.wheel-scroll')[i]
      const lis = ul.children
      const el = lis[current]
      w.scrollToElement(el, BACKTORIGHT, true, true)
    }
    // 找到目前滚动到的节点
    const _findNearestValidWheel = (w, y) => {
      y = y > 0 ? 0 : y < w.maxScrollY ? w.maxScrollY : y;
      return Math.abs(Math.round(-y / itemHeight.value));
    }
    // 处理传入进来的数据
    const _handelPickerColumn1 = (data) => {
      data.forEach((i) => {
        pickerList.column1.push({
          'value': i.value,
          'label': i.label
        })
      })
    }
    const _handelPickerColumn2 = (data, index) => {
      if (data[index].children) {
        pickerList.column2 = data[index].children
      } else {
        pickerList.column2 = []
      }
    }
    onMounted(() => {
      setTimeout(() => {
        _init()
      }, 50)
    })
    watch(column1, (newVal) => {
      if (pickerList.column2.length === 0) {
        return
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        _handelPickerColumn2(props.pickerData, newVal)
        _refresh()
        _rightToRightWheel(wheel[1], 1, 0)
      }, 1000)
    })
    return {
      currentIndex,
      pickerList
    }
  },
  methods: {
    _confirm() {
      if (this.pickerList.column2.length > 0) {
        let temp = [{
          value: this.pickerList.column1[this.currentIndex[0]].value,
          label: this.pickerList.column1[this.currentIndex[0]].label
        },{
          value: this.pickerList.column2[this.currentIndex[1]].value,
          label: this.pickerList.column2[this.currentIndex[1]].label
        }
        ]
        this.$emit(EVENT_CONFIRM, temp)
      } else {
        let temp = [{
          value: this.pickerList.column1[this.currentIndex[0]].value,
          label: this.pickerList.column1[this.currentIndex[0]].label
        }]
        this.$emit(EVENT_CONFIRM, temp)
      }
    },
    _cancel () {
      this.$emit(EVENT_CANCEL)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.picker
  z-index: 100
  width: 100%
  height 100%
  overflow: hidden
  text-align: center
  font-size: 14px
  box-sizing content-box
  background-color: #fff

  .picker-panel
    z-index: 600
    width: 100%
    height: 273px

    .picker-choose
      position: relative
      height: 60px
      color: #999

      .picker-title
        margin: 0
        line-height: 60px
        font-weight: normal
        text-align: center
        font-size: 18px
        color: #333

      .confirm, .cancel
        position: absolute
        top: 6px
        padding: 16px
        font-size: 14px

      .confirm
        right: 0
        color: #007bff

        &:active
          color: #5aaaff

      .cancel
        left: 0

        &:active
          color: #c2c2c2

    .picker-content
      position: relative
      top: 0px

      .mask-top, .mask-bottom
        z-index: 10
        width: 100%
        height: 68px
        pointer-events: none
        transform: translateZ(0)

      .mask-top
        position: absolute
        top: 0
        background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8))

      .mask-bottom
        position: absolute
        bottom: 1px
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8))

      .wheel-wrapper
        padding 0 16px
        display flex

        .wheel
          flex: 1
          width: 1%
          height: 173px
          font-size: 18px
          overflow hidden

          .wheel-scroll
            padding: 0
            margin-top: 68px
            line-height: 36px
            list-style: none

            .wheel-item
              list-style: none
              overflow: hidden
              white-space: nowrap
              color: #333

              &.wheel-disabled-item
                opacity: .2;

    .picker-footer
      height: 20px

</style>