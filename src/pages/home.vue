<template>
  <div class="home">
    <div class="head">
      <div
        class="card"
      >
        <my-image
          width="4rem"
          height="4rem"
          :src="user.logo"
          round
          style="margin-left: 1rem"
        />
        <div class="info">
          <text class="nickname">
            {{ user.nickname }}
          </text>
          <div class="num">
            <text class="item star">
              好评：{{ user.star }}
            </text>
            <text class="item count">
              7豆：{{ user.count }}
            </text>
          </div>
        </div>
      </div>
    </div>
    <div class="title">
      <my-divider
        :style="{ color: '#000000', borderColor: '#000000', width: '85%', margin: '16px auto',fontSize: '1.5rem'}"
      >
        <p>个人资料</p>
      </my-divider>
    </div>
    <div class="use">
      <my-cell
        title="房号"
        :value="user.room"
        :is-link="true"
        @click="onselect(user.room, 'room')"
      />
      <my-cell
        title="电话"
        :value="user.phone"
        :is-link="true"
        @click="onselect(user.phone, 'tel')"
      />
      <my-cell
        title="邮箱"
        :value="user.email"
        :is-link="true"
        @click="onselect(user.email, 'email')"
      />
      <my-cell
        title="你的货品"
        :value="user.goods"
        :is-link="true"
        @click="onShowMyGood"
      />
      <my-cell
        title="你的求助"
        :value="user.wishes"
        :is-link="true"
      />
    </div>
    <my-change-info
      ref="detail"
      :type="type"
    />
    <good-list ref="list"/>
  </div>
</template>

<script type="text/ecmascript-6">
import {Divider, Image, Cell} from 'vant'
import ChangeInfo from '../components/changeInfo'
import {createSubs} from '../model/subs'
import {useStore} from 'vuex'
import {computed} from 'vue'
import GoodList from '../components/goodsList'
export default {
  name: 'Home',
  components: {
    MyDivider: Divider,
    MyImage: Image,
    MyCell: Cell,
    MyChangeInfo: ChangeInfo,
    GoodList:GoodList
  },
  setup() {
    const store = useStore()
    store.dispatch('getUser')
    return {
      // 一旦监测到userInfo有变化就实行马上更新
      user: computed(() => store.getters.userInfo)
    }
  },
  data() {
    return {
      type: ''
    }
  },
  mounted() {
    createSubs()
  },
  methods: {
    onselect(value, type) {
      this.type = type
      this.value = value
      this.$refs.detail.onShow()
    },
    onShowMyGood () {
      this.$refs.list.onShow()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.home
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 3rem;
  width: 100%;
  bgColor(background_color_main)

  .head
    width 100%
    height 10rem
    background-color: $color-theme
    position relative

    .card
      width 85%
      height 8rem
      box-sizing: content-box
      bgColor(background_color_minor)
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 7.5%;

      .info
        margin-left 1.5rem

        .nickname
          font-size: $font-size-large
          fontColor(font_color_main)
          font-weight 700

        .num
          .item
            font-size: $font-size-small
            padding: 3px 5px;
            border-radius: 5px;
            fontColor(font_color_main)

            &.star
              background-color: orange

            &.count
              margin-left 1.2rem
              background-color: red

  .title
    margin-top: 30px

  .use
    .van-cell
      padding: 5px 16px !important
</style>