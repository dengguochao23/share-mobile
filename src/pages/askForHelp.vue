<template>
  <div class="ask">
    <my-head
      :title="'搜索'"
      @back="onBack"
    />
    <div class="input">
      <my-field
        ref="field"
        v-model="data.search"
        :center="true"
        :clearable="true"
        :error-message="data.error"
        label-align="center"
        class="item"
        left-icon="search"
        style="width: 100%;height: 2.5rem;border-radius: 1.5rem;padding-right: 0.8rem !important;"
        @click-left-icon="onSearch"
      />
    </div>
    <scroll
      v-if="data.list.length > 0"
      :data="data.list"
      :total="data.total"
      class="wrapper"
      :pull-up-load="true"
      :bounce-top="false"
      @pullingUp="addPage"
    >
      <section>
        <div
          v-for="good in data.list"
          :key="good.id"
          class="item"
          @click="selectGood(good)"
        >
          <div class="head">
            <div class="user">
              <my-icon name="contact" />
              <p class="name">
                {{ good.user['nickname'] }}
              </p>
            </div>
            <p class="time">
              {{ good.time }}
            </p>
          </div>
          <div class="container">
            <my-image
              radius="10"
              width="80"
              height="80"
            />
            <div class="content">
              <p>{{ good.name }}/{{ good.specification }}/{{ good.detail }}</p>
            </div>
          </div>
          <div class="bottom">
            <p>{{ good.content }}/{{ good.subsname }}</p>
          </div>
        </div>
      </section>
    </scroll>
    <nothing v-else />
    <process
      ref="process"
      class="process"
      :gid="gid"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import {Field, Icon, Image} from 'vant'
import Head from '../components/head'
import {reactive} from 'vue'
import {searchGood} from '../api/search'
import {createGoods} from '../model/good'
import {noramlArray} from "../common/js/util";
import {loading} from "../components/loading";
import Scroll from '../components/scroll'
import Process from '../components/process'
import Nothing from '../components/nothing'
const normalGood = noramlArray(createGoods)
export default {
  components: {
    MyField: Field,
    MyHead: Head,
    Scroll: Scroll,
    MyIcon: Icon,
    MyImage: Image,
    Process: Process,
    Nothing: Nothing
  },
  setup() {
    const data = reactive({
      search: '',
      list: [],
      page: 0,
      total: 0,
      error: ''
    })

    function addPage() {
      if (data.list.length >= data.total) {
        return
      }
      data.page++
      getMore()
    }

    function onSearch() {
      data.list.splice(0, data.list.length) // 清空数组
      data.total = 0
      loading()
      searchGood(data.search, 1).then(res => {
        data.list.push(...normalGood(res.data.data))
        data.page = res.data.page
        data.total = res.data.total
      }).then(() => {
        loading.close()
      })
    }

    function getMore() {
      searchGood(data.search, 1).then(res => {
        data.list.push(...normalGood(res.data.data))
        data.page = res.data.page
        data.total = res.data.total
      }).then(() => {
        loading.close()
      })
    }
    return {
      data,
      onSearch,
      addPage
    }
  },
  data() {
    return {
      gid: 0
    }
  },
  methods: {
    onBack() {
      this.$router.back()
    },
    selectGood(good) {
      this.gid = good.gid
      this.$refs.process.onShow()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.ask
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  bgColor(background_color_main)

  .input
    height 3rem
    line-height 3rem
    background-color: $color-theme

    .item
      padding-left 20px !important

  .wrapper
    position fixed
    top 6rem
    left 0
    bottom 0
    right 0
    overflow hidden

    .item
      width 95%
      min-height: 10rem;
      bgColor(background_color_minor)
      fontColor(font_color_main)
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      border-radius: 10px;
      margin: 0 auto;
      margin-top: 15px;
      margin-bottom: 15px;
      font-size: $font-size-small;

      .head
        height: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 15px;
        margin-right: 15px;
        border-bottom: 1px solid #DCDFE6;

        .user
          display: flex;
          align-items: center;
          color $color-theme

      .container
        display: flex;
        margin: 15px 10px 0 10px;
        align-items: center;

        .content
          lex: 1;
          width: 200px;
          font-size: $font-size-medium;
          margin-left: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

      .bottom
        height: 50px;
        display flex
        margin-left: 15px;
        margin-right: 15px;

.van-field__left-icon
  margin-right 20px !important
</style>