<template>
  <div
    ref="root"
    class="shop"
  >
    <my-head
      :title="'积分兑换'"
      @back="back"
    />
    <section>
      <sidebar
        class="sidebar"
        :title="title"
        @change="scrollTo"
      />
      <scroll
        ref="scroll"
        class="list"
        :data="data.list"
      >
        <ul ref="listGroup">
          <li
            v-for="(item,index) in data.list"
            :key="index"
            class="item"
          >
            <my-image
              class="img"
              width="80"
              height="80"
              :src="item.image"
            />
            <div class="content">
              <p>物品： {{ item.name }}</p>
              <p>分值： {{ item.price }}</p>
              <p>库存： {{ item.stock }}</p>
            </div>
            <my-cart-control
              class="cart-control"
              :count="computedCount(item.id)"
              :max="item.stock"
              @add="addShopCart(item)"
              @reduce="cutShopCart(item)"
            />
            <div
              v-if="item.stock===0"
              class="null"
            >
              <p>已兑换完</p>
            </div>
          </li>
        </ul>
      </scroll>
    </section>
    <cart-list
      ref="cartList"
      class="cart-list"
      :list="shop"
      @change="selectShop"
    />
    <div class="shop-cart">
      <div
        ref="shopCart"
        class="icon"
        @click.stop="showList"
      >
        <my-icon
          name="cart-o"
          :size="'40px'"
          color="#1989fa"
          :badge="badge"
        />
      </div>
      <p class="total">
        ￥ {{ totalPrice }}豆
      </p>
      <my-button
        type="primary"
        size="small"
        round
        block
        class="button"
        @click.stop="submit"
      >
        提交
      </my-button>
    </div>
    <div
      v-for="(ball, index) in balls"
      :key="index"
    >
      <transition
        @before-enter="beforeDrop"
        @enter="droping"
        @after-enter="afterDrop"
      >
        <div
          v-show="ball.show"
          class="ball"
        >
          <div class="inner inner-hook">
            <img
              :src="ball.url"
              alt=""
              class=""
            >
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {reactive, ref, toRef, computed, toRaw, watch} from 'vue'
import MyHead from '../components/head'
import Sidebar from '../components/sidebar'
import Scroll from '../components/scroll'
import MyCartControl from '../components/cart-control'
import {getAllShopOfType} from '../api/shop'
import {Image, Icon, Button} from 'vant'
import {useStore} from "vuex";
import CartList from '../components/shopCartList'
import {sellMyShop} from '../api/shop'
import {success} from '../components/success'
import {fail} from '../components/fail'
const BALL_LEN = 10 // 设置球子的数量
const innerClsHook = 'inner-hook'
function createBalls() {
  let balls = []
  for (let i = 0; i < BALL_LEN; i++) {
    balls.push({
      show: false
    })
  }
  return balls
}

export default {
  components: {
    MyHead: MyHead,
    Sidebar: Sidebar,
    MyImage: Image,
    MyCartControl: MyCartControl,
    Scroll: Scroll,
    MyIcon: Icon,
    MyButton: Button,
    CartList: CartList
  },
  setup() {
    const store = useStore()
    const data = reactive({
      list: [],
      typeLength: [0],
      selected: []
    })
    const root = ref(null)
    const list = toRef(data, 'list')
    const shop = computed(() => store.getters.myShop)
    async function _init() {
      await _getAllShop(1)
      await _getAllShop(2)
    }

    function _getAllShop(type) {
      getAllShopOfType(type).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i]
          data.list.push(item)
        }
        data.typeLength.push(res.data.length)
      })
    }
    function addShop (shop) {
      store.dispatch('addShop',shop)
    }
    function cutShopCart (shop) {
      if(shop.num === 1) {
        store.dispatch('deleteShop', shop)
      } else {
        store.dispatch('cutShop', shop)
      }
    }
    function selectShop (select){
      data.selected = select
    }
    function submit () {
      let torawdata = toRaw(data)
      let shop = store.getters.myShop
      // 判断购物车为空
      if (shop.length ===0 ) {
        fail('购物车为空')
        return
      }
      let temp = []
      let selected = torawdata.selected
      for (let i in shop) {
        let item = shop[i]
        if (selected.findIndex(value => value === item.id) > -1) {
          temp.push({
            'id': item.id,
            'name': item.name,
            'price': item.price,
            'num': item.num
          })
        }
      }
      sellMyShop(temp).then(()=>{
        success('兑换成功')
      }).catch((rej) => {
        let meg = rej.data.meg
        fail(meg)
      })
    }
    watch(shop, (newVal) => {
      newVal.forEach((i) => {
        data.selected.push(i.id)
      })
    })
    _init()
    return {
      data,
      root,
      list,
      badge: computed(()=> Object.keys(store.getters.myShop).reduce((pre, cur)=>{
        return pre + store.getters.myShop[cur].num
      },0)),
      totalPrice: computed(()=> Object.keys(store.getters.myShop).reduce((pre, cur)=>{
        return pre + (store.getters.myShop[cur].num * store.getters.myShop[cur].price)
      },0)),
      shop,
      addShop,
      cutShopCart,
      selectShop,
      submit
    }
  },
  data() {
    return {
      title: ['蔬菜', '水果'],
      happy: 200,
      balls: createBalls(), // 用来控制小球的显示隐藏
      ballLeft: 0,
      ballTop: 0,
    }
  },
  computed: {
  },
  created() {
    this.dropBalls = []
  },
  methods: {
    back() {
      this.$router.back()
      // this.$refs.scroll.scrollToElement(this.$refs.listGroup.children[5], 200)
    },
    computedCount (id) {
      // eslint-disable-next-line no-unused-vars
      let count = 0
      let arr = Object.keys(this.shop)
      for (let i= 0; i<arr.length;i++) {
        if (this.shop[i].id === id) {
          count =  this.shop[i].num
        }
      }
      return count
    },
    showList() {
      if (this.shop.length === 0) {
        fail('购物车为空')
        return
      }
      this.$refs.cartList.openShopCart()
    },
    // 快速滚动
    scrollTo (item) {
      let target = this.data.typeLength[item.id]
      this.$refs.scroll.scrollToElement(this.$refs.listGroup.children[target], 200)
    },
    // 小球飞入的 动画
    addShopCart(item) {
      // 获得球的高度
      this.ballLeft = event.currentTarget.getBoundingClientRect().left
      this.ballTop = event.currentTarget.getBoundingClientRect().top
      let shop = {
        'id': item.id,
        'name': item.name,
        'price': item.price,
        'num': 1,
        'stock': item.stock
      }
      this.addShop(shop)
      for (let i = 0; i < this.balls.length; i++) {
        const ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = event.currentTarget
          ball.url = item.image
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeDrop(el) {
      // 初始化球的高度
      const inner = el.getElementsByClassName(innerClsHook)[0]
      el.style.display = ''
      el.style.transform = `translate3d(0px,${this.ballTop + 12}px, 0)`
      inner.style.transform = `translate3d(${this.ballLeft}px,0, 0)`
    },
    droping(el, done) {
      this._reflow = document.body.offsetHeight // 重新计算小球高度
      const shopCart = this.$refs.shopCart.getBoundingClientRect()
      const shopCartLeft = shopCart.left + 33
      const shopCartTop = shopCart.top + 33
      const inner = el.getElementsByClassName(innerClsHook)[0]
      // 小球滚动的行程
      el.style.transform = `translate3d(0px,${Math.abs(shopCartTop)}px,0)`
      inner.style.transform = `translate3d(${Math.abs(shopCartLeft)}px,0,0)`
      // 小球动画的时间
      el.addEventListener('transitionend', done)
    },
    afterDrop(el) {
      const ball = this.dropBalls.shift() // 目的是小球回收,拿到第一个小球
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
      this.ballTop = 0
      this.ballLeft = 0
    },
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.shop
  width 100%
  height 100%
  bgColor(background_color_main)
  position fixed
  top 0
  left 0

  section
    width 100%

    .sidebar
      position fixed
      top 3rem
      left 0
      width 30%

    .list
      position fixed
      width 70%
      right 0
      top 3rem
      bottom 3rem
      bgColor(background_color_minor)
      overflow hidden

      ul
        .item
          display: flex;
          margin-top: 2rem;
          position: relative;
          font-size: $font-size-small
          position relative
          min-height 100px
          align-items center

          .img
            margin 0 20px 0 10px

          .content
            display: flex;
            flex: 1;
            fontColor(font_color_main)
            flex-direction: column;
          .cart-control
            position absolute
            width 3rem
            bottom 5px
            right 10px
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-right: 20px;
          .null
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            p
              font-size $font-size-large-xx
              color $color-theme
  .shop-cart
    position fixed
    bottom 0
    left 0
    width 100%
    height 3rem
    bgColor(background_color_minor)
    border-top 3px solid $color-theme
    z-index 5000
    .icon
      width 66px
      height 66px
      bgColor(background_color_main)
      border-radius 50%
      display flex
      justify-content center
      align-items center
      position absolute
      left 1rem
      bottom 10px

    .total
      position absolute
      left 6rem
      top 50%
      transform translateY(-50%)
      fontColor(font_color_main)
    .button
      position absolute
      top 50%
      right 30px
      transform translateY(-50%)
      width 3rem

  .ball
    position: fixed
    z-index: 1000
    top: 0
    left: 0
    transition: all 0.88s cubic-bezier(0.275, -0.32, 0.885, 0.175)

    .inner
      width: 20px
      height: 20px
      border-radius: 50%
      transition: all 0.88s linear

    img
      width: 20px
      height: 20px
      border-radius: 50%
      animation: 0.88s shopImg

@keyframes shopImg
  0%
    transform: scale(2.5)
  25%
    transform: scale(1.8)
  50%
    transform: scale(1.2)
  75%
    transform: scale(0.6)
  100%
    transform: scale(0.3)
</style>