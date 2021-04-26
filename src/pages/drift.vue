<template>
  <div class="dirft">
    <tabs
      class="tab"
      :tabs="tabs"
      @change="changeTypeToRefreshDirft"
    />
    <div class="wrapper">
      <my-scroll
        v-if="data.list.length > 0"
        ref="scroll"
        :data="data.list"
        class="list"
        :total="data.total"
        :pull-up-load="true"
        :refresh-delay="100"
        @pullingUp="addPage"
      >
        <section>
          <div
            v-for="good in data.list"
            :key="good.id"
            class="item"
          >
            <div class="head">
              <div class="user">
                <my-icon name="contact" />
                <p class="name">
                  {{ good.youare == 'helper' ? '我是求助者' : '我是分享者' }}
                </p>
              </div>
              <p class="status">
                {{ good.req }}
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
              <p>{{ good.time }}</p>
              <div
                v-if="good.youare==='helper'"
                class="helper"
              >
                <my-button
                  v-if="good.pending===1"
                  type="danger"
                  size="mini"
                  round
                  style="padding: 0 5px"
                  @click.stop="onCancalDrift(good.gid)"
                >
                  撤销
                </my-button>
                <my-button
                  v-if="good.pending===6"
                  size="mini"
                  round
                  style="padding: 0 5px"
                  @click.stop="onOpenComment(good.gid)"
                >
                  评价
                </my-button>
              </div>
              <div
                v-else
                class="sharer"
              >
                <div v-if="good.pending==1">
                  <my-button
                    type="primary"
                    size="mini"
                    round
                    style="padding: 0 5px"
                    @click.stop="onSubmitReview(good.id,good.gid,good.youare,2)"
                  >
                    审核通过
                  </my-button>
                  <my-button
                    type="danger"
                    size="mini"
                    round
                    style="padding: 0 5px"
                    @click.stop="onSubmitReview(good.id,good.gid,good.youare,4)"
                  >
                    审核不通过
                  </my-button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </my-scroll>
      <nothing v-else />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tabs from '../components/tabs'
import {pending, handlePending, cancalDriftByid} from '../api/drift'
import {createPending} from '../model/pending'
import {noramlArray} from "../common/js/util";
import MyScroll from '../components/scroll'
import {reactive} from 'vue'
import {Icon, Image, Button} from 'vant'
import Nothing from '../components/nothing'
const normalPending = noramlArray(createPending)
import {loading} from '../plugin/loading'
export default {
  name: 'Drift',
  components: {
    Tabs: Tabs,
    MyScroll: MyScroll,
    MyIcon: Icon,
    MyImage: Image,
    MyButton: Button,
    Nothing: Nothing
  },
  setup() {
    const data = reactive({
      list: [],
      page: 0,
      total: 0,
      type: ''
    })
    function addPage() {
      if (data.list.length >= data.total) {
        return
      }
      data.page++
      getPending(data.type, data.page)
    }

    function getPending(type, page) {
      loading()
      pending(page, type).then(res => {
        data.total = res.data.total
        data.list.push(...normalPending(res.data.data))
        data.page = res.data.page
        data.type = type
      }).then(() => {
        loading.close()
      })
    }

    async function refreshState(type) {
      data.page = 0
      data.list.splice(0, data.list.length)
      data.total = 0
      data.type = type ? type : data.type
      await getPending(data.type, 1)
    }
    getPending('all', 1)
    return {
      data,
      addPage,
      refreshState
    }
  },
  data() {
    return {
      tabs: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '求助',
          value: 'helper'
        },
        {
          label: '分享',
          value: 'sharer'
        }
      ]
    }
  },
  methods: {
    changeTypeToRefreshDirft(e) {
      let type = e.value
      this.refreshState(type)
    },
    onCancalDrift(gid) {
      cancalDriftByid(gid).then(() => {
        this.$success()
        this.refreshState()
      })
    },
    onSubmitReview(id, gid, youare, pending) {
      handlePending(id, gid, youare, pending).then(() => {
        this.$success()
        this.refreshState()
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../common/stylus/index.styl"
.dirft
  position: fixed
  top 0px
  left 0
  bottom 3rem
  right 0
  bgColor(background_color_main)

  .wrapper
    margin-top 15px
    overflow hidden
    position fixed
    top 3rem
    left 0
    bottom 3rem
    right 0
    .list
      position absolute
      top 0
      left 0
      width 100%
      height 100%
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

          .status
            color #F56C6C

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
          display: flex;
          justify-content: space-between;
          height: 50px;
          align-items: center;
          margin-left: 15px;
          margin-right: 15px;

          p
            flex 1
</style>