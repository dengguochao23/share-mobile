<template>
  <div class="main">
    <my-scroll
      class="wrapper"
    >
      <section>
        <div class="head">
          <my-image
            width="7rem"
            height="7rem"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            round
          />
          <p>Hi,{{ user.nickname }}</p>
          <p>房号：{{ user.room }}</p>
        </div>
        <div class="info">
          <div class="item">
            <p class="num">
              {{ user.wishes }}
            </p>
            <p class="name">
              求助
            </p>
          </div>
          <div class="item">
            <p class="num">
              {{ user.goods }}
            </p>
            <p class="name">
              可借
            </p>
          </div>
          <div class="item">
            <p class="num">
              {{ user.comment }}
            </p>
            <p class="name">
              可评价
            </p>
          </div>
          <div class="item">
            <p class="num">
              {{ user.count }}
            </p>
            <p class="name">
              7豆
            </p>
          </div>
        </div>
        <my-divider
          :style="{ color: '#000000', borderColor: '#000000', width: '85%', margin: '16px auto',fontSize: '1.5rem'}"
        >
          <p>功能</p>
        </my-divider>
        <div class="container">
          <div
            class="item ask"
            @click="onAskForHelp"
          >
            <my-icon
              class="left"
              size="2rem"
              name="phone-o"
            />
            <div class="name">
              <p class="title">
                我要求助
              </p>
              <p class="context">
                你可以向他人求助
              </p>
            </div>
            <my-icon
              class="right"
              name="arrow"
              size="2rem"
            />
          </div>
          <div
            class="item hot"
            @click="onHot"
          >
            <my-icon
              class="left"
              size="2rem"
              name="hot-o"
            />
            <div class="name">
              <p class="title">
                热心住户
              </p>
              <p class="context">
                贡献最多的用户
              </p>
            </div>
            <my-icon
              class="right"
              name="arrow"
              size="2rem"
            />
          </div>
          <div class="item help">
            <my-icon
              class="left"
              size="2rem"
              name="question-o"
            />
            <div class="name">
              <p class="title">
                他人求助
              </p>
              <p class="context">
                你可以给他人帮助
              </p>
            </div>
            <my-icon
              class="right"
              name="arrow"
              size="2rem"
            />
          </div>
          <div
            class="item shop"
            @click="onShop"
          >
            <my-icon
              class="left"
              size="2rem"
              name="bag-o"
            />
            <div class="name">
              <p class="title">
                我要兑换
              </p>
              <p class="context">
                你可以兑换你想要的东西
              </p>
            </div>
            <my-icon
              class="right"
              name="arrow"
              size="2rem"
            />
          </div>
        </div>
        <div class="bottom">
          <my-switch />
        </div>
      </section>
    </my-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import {useStore} from 'vuex'
import {computed, ref} from 'vue'
import Scroll from '../components/scroll'
import {Image, Divider, Icon} from 'vant'
import Switch from '../components/changeTheme'
export default {
  components: {
    MyScroll: Scroll,
    MyImage: Image,
    MyDivider: Divider,
    MyIcon: Icon,
    MySwitch: Switch
  },
  setup() {
    let theme = ref(true)
    const store = useStore()
    store.dispatch('getUser')
    return {
      user: computed(() => store.getters.userInfo),
      theme
    }
  },
  data() {
    return {}
  },
  methods: {
    onAskForHelp(){
      this.$router.push('/ask').catch(err => err)
    },
    onHot() {
      this.$router.push('/hot').catch(err => err)
    },
    onShop() {
      this.$router.push('/shop').catch(err => err)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl";

.main
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 3rem;
  width: 100%;
  .wrapper
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 3rem;
    overflow: hidden;
    background-color: $color-theme;
    section
      width: 100%;
      bgColor(background_color_main)
      .head
        background-color: $color-theme;
        width: 100%;
        height: 18rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-bottom-left-radius: 45%;
        border-bottom-right-radius: 45%;
        p
          margin-top: 0.8rem;
          font-weight: 700;
          color : white
      .info
        width: 85%;
        height: 5rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        bgColor(background_color_minor);
        border-radius: 0.5rem;
        box-shadow: 0px 2px 8px #A6A6A6;
        margin: 0 auto;
        margin-top: 1rem;
        .item
          display: flex;
          flex-direction: column;
          align-items: center;
          fontColor(font_color_main)
      .container
        width: 85%;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        justify-content: center;
        .item
          max-width: 100%;
          border-radius: 0.8rem;
          height: 5rem;
          display: flex;
          font-size: $font-size-medium;
          align-items: center;
          color: #ffff;
          margin-bottom: 10px;
          background-color: red;
          &.ask
            background-color: $color-theme;
          &.hot
            background-color: #F56C6C;
          &.help
            background-color: rgb(0, 172, 83);
          &.shop
            background-color: #909399;
          .left
            margin-left: 1rem;
            margin-right: 1rem;
          .name
            flex: 1;
            .title
              font-size: $font-size-large-x;
              font-weight: 700;
              margin-right: 1rem;
          .right
            margin-right: 1rem;

      .bottom
        margin-top : 1.5rem
</style>