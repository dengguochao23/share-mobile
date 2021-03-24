<template>
  <transition name="list">
    <div
      v-if="visable"
      class="list"
    >
      <my-head
        :title="'我的货物'"
        @back="onShow"
      />
      <my-scroll
        v-if="data.list.length > 0"
        ref="scroll"
        class="wrapper"
        :data="data.list"
        :total="data.total"
        :pull-up-load="true"
        :refresh-delay="500"
        @pullingUp="onPullingUp"
      >
        <section>
          <div
            v-for="item in data.list"
            :key="item.gid"
            class="item"
          >
            <div class="head">
              <p>{{ item.time }}</p>
              <p class="status">
                {{ item.status }}
              </p>
            </div>
            <div class="container">
              <my-image
                radius="10"
                width="4rem"
                height="4rem"
                :src="item.image"
              />
              <div class="content">
                <p>{{ item.name }}/{{ item.specification }}/{{ item.detail }}</p>
              </div>
            </div>
            <div class="bottom">
              <div class="fromAdmin">
                <p>{{ item.fromAdmin }}</p>
              </div>
              <my-button
                v-if="item.status=='使用中'"
                type="danger"
                size="mini"
                round
                block
                class="button"
                @click="onCancel(item.gid)"
              >
                撤销
              </my-button>
              <my-button
                v-else
                size="mini"
                color="#1c92d2"
                round
                block
                class="button"
                @click="onConfirm(item.gid)"
              >
                使用
              </my-button>
            </div>
          </div>
        </section>
      </my-scroll>
      <nothing v-else />
      <my-button
        type="primary"
        size="large"
        class="but"
        @click="addGood"
      >
        添加我的货品
      </my-button>
      <add-good ref="addGood" />
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {reactive, onBeforeMount} from 'vue'
import {Button, Image} from 'vant'
import {noramlArray} from "../common/js/util";
import {getMyGoods} from "../api/goods";
import {createGoods} from "../model/good"
import {handleMyGood} from '../api/goods'
import Scroll from '../components/scroll'
import Head from '../components/head'
import AddGood from '../components/addGood'
import Nothing from '../components/nothing'
const normalGoods = noramlArray(createGoods)
export default {
  name: 'GoodList',
  components: {
    MyHead: Head,
    MyButton: Button,
    MyImage: Image,
    MyScroll: Scroll,
    AddGood: AddGood,
    Nothing: Nothing
  },
  setup() {
    const data = reactive({
      list: [],
      page: 0,
      total: 0
    })
    function addPage() {
      if (data.list.length >= data.total) {
        return
      }
      data.page++
      getMyGoodsByPage(data.page)
    }
    onBeforeMount(()=>{
      getMyGoodsByPage(1)
    })
    function getMyGoodsByPage(page) {
      this.$loading()
      getMyGoods(page).then(res => {
        data.list.push(...normalGoods(res.data.data))
        data.page = res.data.page
        data.total = res.data.total
      }).then(()=>{
        this.$loading.close()
      })
    }
    async function freshState () {
      data.page = 0
      data.list.splice(0, data.list.length) // 清空数组
      data.total = 0
      await addPage()
    }
    return {
      data,
      addPage,
      freshState
    }
  },
  data () {
    return {
      visable: false
    }
  },
  methods: {
    onShow() {
      this.visable = !this.visable
    },
    onPullingUp () {
      this.addPage()
    },
    onCancel(gid) {
      handleMyGood(gid, 10).then(()=>{
        this.freshState()
      })
    },
    onConfirm(gid) {
      handleMyGood(gid, 11).then(()=>{
        this.freshState()
      })
    },
    addGood() {
      this.$refs.addGood.onShow()
    }
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.list
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height 100%
  bgColor(background_color_main)
  &.list-enter-from, &.list-leave-to
    transform: translateX(100%)

  &.list-enter-active, &.list-leave-active
    transition: all 0.3s
  .wrapper
    margin-top 15px
    overflow hidden
    position fixed
    top 3rem
    bottom 3rem
    left 0
    right 0

    section
      width 100%

      .item
        width 92%
        min-height: 10.5rem;
        bgColor(background_color_minor)
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        border-radius: 10px;
        margin: 0 auto;
        margin-top: 15px;
        margin-bottom: 15px;
        font-size $font-size-small
        fontColor(font_color_main)
        .head
          height: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: 1rem;
          margin-right: 1rem;
          border-bottom: 1px solid #DCDFE6;

        .container
          display: flex;
          margin: 1.5rem 1rem 0 1rem;
          align-items: center;

          .content
            flex: 1;
            width: 10rem;
            font-size: $font-size-medium;
            margin-left: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

        .bottom
          display: flex;
          justify-content: space-between;
          height: 2.5rem;
          align-items: center;
          margin-left: 1rem;
          margin-right: 1rem;
          font-size: $font-size-small

          .button
            width 3rem

  .but
    position absolute
    left 0
    bottom 0
    width 100%
    height 3rem
</style>