<template>
  <div class="use">
    <div
      ref="head"
      class="head"
    >
      <my-icon
        name="arrow-left"
        size="32px"
        class="icon"
        @click="back"
      />
    </div>
    <div
      ref="bgImage"
      class="bg-image"
      :style="bgStyle"
    />
    <div
      ref="info"
      class="info"
    >
      <my-image
        width="7rem"
        height="7rem"
        :src="logo"
        round
        class="logo"
      />
      <p class="nickname">
        {{ nickname }}
      </p>
      <p class="room">
        {{ room }}
      </p>
    </div>
    <scroll
      ref="listGroup"
      class="list"
      :data="data.list"
      :refresh-delay="500"
      :probe-type="3"
      @scroll="scroll"
    >
      <ul class="list-wrapper">
        <li
          v-for="(good,index) in data.list"
          :key="good.gid"
          class="item"
          @click.stop="select(good)"
        >
          <p class="num">
            {{ index + 1 }}
          </p>
          <div class="name">
            <span>{{ good.name }}</span>
          </div>
          <my-icon
            class="arrow"
            name="arrow"
          />
        </li>
      </ul>
    </scroll>
    <process
      ref="process"
      class="process"
      :gid="gid"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import {Icon, Image} from 'vant'
import {createGoods} from "../model/good";
import {noramlArray} from "../common/js/util";
import {getGoodsByUid} from '../api/goods'
import {reactive} from 'vue'
import Scroll from '../components/scroll'
import Process from '../components/process'
const normalGood = noramlArray(createGoods)
const RESERVED_HEIGHT = 48
export default {
  components: {
    MyIcon: Icon,
    MyImage: Image,
    Scroll: Scroll,
    Process: Process
  },
  props: {
    uid: {
      type: String,
      default() {
        return ''
      }
    },
    nickname: {
      type: String,
      default() {
        return ''
      }
    },
    room: {
      type: String,
      default() {
        return ''
      }
    },
    logo: {
      type: String,
      default() {
        return ''
      }
    }
  },
  setup(props) {
    const data = reactive({
      list: []
    })
    function _getGood(uid) {
      getGoodsByUid(uid).then((res) => {
        data.list = data.list.concat([...normalGood(res.data)])
      })
    }
    _getGood(props.uid)
    return {
      data
    }
  },
  data() {
    return {
      gid: 0,
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.logo})`
    }
  },
  watch: {
    scrollY (newVal) {
      let scale = 1
      let zIndex = 0
      let blur = 0
      const percent = Math.abs(newVal / this.imageHeight)
      if (newVal > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 20)
      }
      this.$refs.bgImage.style.backdropFilter = `blur(${blur}px)`
      if (newVal < this.minTransalteY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.bgImage.style.opacity = 1
        this.$refs.info.style.zIndex = 0
        this.$refs.head.style.zIndex = 11
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.bgImage.style.opacity = 0.6
        this.$refs.info.style.zIndex = zIndex
      }
      this.$refs.bgImage.style.transform = `scale(${scale})`
      this.$refs.bgImage.style.zIndex = zIndex
    }
  },
  mounted() {
    setTimeout(() => {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.listGroup.$el.style.top = `${this.imageHeight}px`
    }, 50)
  },
  methods: {
    back() {
      this.$router.back()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    select (good) {
      this.gid = good.gid
      this.$refs.process.onShow()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.use
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  bgColor(background_color_main)

  .head
    width 100%
    height 48px
    position relative
    z-index 2
    .icon
      width 3rem
      height 48px
      position absolute
      left 0.3rem
      top 0
      line-height 48px

  .bg-image
    overflow hidden
    position absolute
    top 0
    left 0
    height 0
    width 100%
    padding-top: 70%
    transform-origin: top
    background-size cover
    opacity: 0.6;
    display flex
  .info
    position absolute
    min-width 6rem
    top 4rem
    left 50%
    transform translateX(-50%)
    display flex
    flex-direction column
    align-items center
    font-weight 900
    color white

    .nickname
      margin 10px 0
  .list
    position fixed
    left 0
    bottom 0
    right 0
    top 0
    .list-wrapper
      bgColor(background_color_main)
      .item
        width: 100%;
        font-size: $font-size-small
        height: 40px;
        bgColor(background_color_minor)
        fontColor(font_color_minor)
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .num
          text-align: center;
          width: 15%;
          padding-left: 20px;

        .name
          flex: 1;

          span
            margin-right 8px

        .arrow
          width: 10%;
          display: flex;
          justify-content: space-between;
          align-items center
          margin-right: 10px;

</style>