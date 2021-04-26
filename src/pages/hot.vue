<template>
  <div class="hot">
    <my-head
      :title="'热心住户'"
      @back="onBack"
    />
    <div class="ranking">
      <div class="my">
        <p>目前你排名为第{{ data.myRank }}</p>
      </div>
      <div class="icon">
        <my-icon
          size="60px"
          name="hot-o"
        />
      </div>
    </div>
    <div class="title">
      <p>排名</p>
      <p>用户</p>
      <p>7豆</p>
    </div>
    <scroll
      ref="listView"
      class="list"
      :data="data.list"
      :pull-up-load="true"
      :probe-type="3"
      :refresh-delay="500"
      @pullingUp="addPage"
      @scroll="onScroll"
    >
      <ul ref="listGroup">
        <li
          v-for="(use,index) in list"
          :key="use.uid"
          class="item"
          @click="onSelect(use)"
        >
          <p class="num">
            {{ index + 1 }}
          </p>
          <div class="nickname">
            <span>{{ use.nickname }}</span>
            <my-icon
              v-if="index < 3 "
              size="16px"
              name="good-job-o"
            />
          </div>
          <div class="count">
            <p>{{ use.count }}个</p>
            <my-icon
              class="arrow"
              name="arrow"
            />
          </div>
        </li>
        <div
          v-if="computedNextPage"
          class="nextPage"
          @click="nextPage"
        >
          <my-button
            size="mini"
            color="#1c92d2"
            block
            class="button"
          >
            下一页
          </my-button>
        </div>
        <p
          v-if="data.page === data.pages"
          class="nothing"
        >
          没有更多内容了
        </p>
      </ul>
    </scroll>
    <div
      class="list-shortcut"
      @touchstart.stop="onShortcutTouchStart"
    >
      <ul ref="listShortcut">
        <li
          v-for="(p,index) in data.pageArray"
          :key="index"
          :data-index="index"
          class="item"
          :class="{'active': currentPage === index}"
        >
          {{ p }}
        </li>
      </ul>
    </div>
    <router-view name="hotRouter" />
  </div>
</template>

<script type="text/ecmascript-6">
import {Icon, Button} from 'vant'
import Head from '../components/head'
import {getAllUser, ranking} from '../api/user'
import {reactive, onBeforeMount, toRef, computed} from 'vue'
import {noramlArray} from "../common/js/util";
import {createUser} from "../model/user";
import Scroll from '../components/scroll'
import {getData} from '../common/js/dom'
import {useStore} from 'vuex'
import {loading} from '../plugin/loading'
const normalUser = noramlArray(createUser)
const EACH_PAGE = 20 // 每页的数量
const ITEMHEIGHT = 50
export default {
  components: {
    MyIcon: Icon,
    MyHead: Head,
    Scroll: Scroll,
    MyButton: Button
  },
  setup() {
    const store = useStore()
    const data = reactive({
      list: [],
      page: 0,
      pageArray: [],
      pages: 0,
      myRank: '',
    })
    // 进一步提升了熏染速度
    const list = computed({
      get: () => data.list,
      set: val => {
        data.list.push(...val)
      }
    })
    const page = toRef(data, 'page')
    function addPage() {
      if (data.page === data.pages || data.list.length % 200 === 0) {
        return
      }
      data.page++
      _getAllUserByPage(data.page)
    }
    function nextPage () {
      data.list.splice(0, data.list.length)
      data.pageArray.splice(0,10)
      data.page++
      _getAllUserByPage(data.page)
    }
    function _getAllUserByPage(page) {
      loading()
      getAllUser(page).then(res => {
        list.value = normalUser(res.data.data)
        data.page = res.data.page
        data.pageArray.push(res.data.page)
        data.pages = res.data.pages
      }).then(() => {
        loading.close()
      })
    }

    function _ranking() {
      ranking().then(res => {
        data.myRank = res.data.ranking + 1
      })
    }
    onBeforeMount(() => {
      _getAllUserByPage(1)
      _ranking()
    })
    return {
      data,
      addPage,
      nextPage,
      page,
      list,
      use: computed(() => store.getters.userInfo)
    }
  },
  data() {
    return {
      currentPage: 0,
      scrollY: -1
    }
  },
  computed: {
    computedNextPage () {
      return this.data['list'].length % 200 === 0
    }
  },
  watch: {
    page (current) {
      this.pageList.push(current * EACH_PAGE)
      this.listHeight.push((current * EACH_PAGE) * ITEMHEIGHT)
      this.currentPage = current - 1
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentPage = i
          return
        }
      }
    }
  },
  created() {
    this.touch = {}
    this.pageList = [0]
    this.listHeight = [0]
  },
  methods: {
    onBack() {
      this.$router.back()
    },
    // 快速滚动的设置开始
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.anchorIndex = anchorIndex
      this.touch.y1 = firstTouch.pageY
      this._scrollTo(this.pageList[anchorIndex])
    },
    onScroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      this.$refs.listView.scrollToElement(this.$refs.listGroup.children[index], 200)
    },
    onSelect (row) {
      if (this.use.uid === row.uid) {
        this.$router.push('/home')
      } else {
        this.$router.push({ name: 'use', params: { uid: row.uid, nickname: row.nickname, room: row.room, logo: row.logo } }).catch(err => err)
      }
    },
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.hot
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  bgColor(background_color_main)

  .ranking
    width: 100%;
    height: 6rem;
    background-color: $color-theme;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: $font-size-large;
    font-weight: 700;

    .my
      width: 60%;
      text-align: center;

    .icon
      text-align: center;
      width: 40%;

  .title
    width: 100%;
    height: 3rem;
    background-color: $color-theme
    color: white;
    font-size: $font-size-medium-x
    display: flex;
    justify-content: flex-start;
    align-items: center;

    p:nth-child(1)
      width: 15%;
      padding-left: 20px;

    p:nth-child(2)
      flex 1

    p:nth-child(3)
      width 20%

  .list
    position: fixed;
    top: 12rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow hidden

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

      .nickname
        flex: 1;

        span
          margin-right 8px

      .count
        width: 20%;
        display: flex;
        justify-content: space-between;
        align-items center

        .arrow
          margin-right: 10px;
    .nextPage
      width 20%
      margin 0 auto
      padding-bottom 40px
    .nothing
      font-size $font-size-small
      margin 0 auto
      text-align center
      fontColor(font_color_minor)

  .list-shortcut
    bgColor(background_color_main)
    fontColor(font_color_main)
    position: fixed;
    left 0
    top 50%
    transform translate3d(0 -50%, 0)
    display flex
    flex-direction row
    justify-content center
    width: 8%
    padding: 10px 0 10px
    text-align: center
    border-top-right-radius 10px
    border-bottom-right-radius 10px
    font-family: Helvetica

    .item
      padding: 1px
      font-size: $font-size-medium
      line-height: 1
      &.active
        color: $color-theme
</style>