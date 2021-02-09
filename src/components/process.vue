<template>
  <transition name="detail">
    <div
      v-if="visable"
      class="detail"
    >
      <my-head @back="onHide" />
      <scroll
        class="scroll"
        :bounce-top="false"
        :data="comment"
      >
        <div class="head">
          <div class="status">
            <p>{{ state.status }}</p>
          </div>
          <div class="icon">
            <my-icon
              size="50px"
              name="logistics"
            />
          </div>
        </div>
        <div class="next">
          <p class="title">
            下一步：{{ state.next }}
          </p>
          <p class="content">
            {{ state.nextinfo }}
          </p>
        </div>
        <div class="good">
          <my-image
            radius="10"
            width="80"
            height="80"
          />
          <div class="content">
            <p>{{ data.good.name }}/{{ data.good.specification }}/{{ data.good.detail }}</p>
          </div>
        </div>
        <div class="user">
          <p class="title">
            物品租借者
          </p>
          <p class="nickname">
            昵称： {{ data.user.nickname }}
          </p>
          <p class="room">
            房号： {{ data.user['building'] }}-{{ data.user['unit'] }}-{{ data.user['room'] }}
          </p>
          <div class="star">
            <p>评分：</p>
            <my-rate
              size="12"
              readonly
              :value="data.good.star"
            />
          </div>
        </div>
        <div class="comment">
          <p class="title">
            评论
          </p>
          <div
            v-if="comment.length> 0"
            class="container"
          >
            <div
              v-for="(item, index) in comment"
              :key="index"
              class="item"
            >
              <div class="use">
                <my-image
                  radius="30"
                  width="30"
                  height="30"
                  src="{{item.userLogo}}"
                />
                <div class="name">
                  <p>{{ item.username }}</p>
                </div>
              </div>
              <div class="starAndTime">
                <my-rate
                  size="12"
                  readonly
                  value="{{item.star}}"
                />
                <p class="time">
                  {{ item.time }}
                </p>
              </div>
              <div class="content">
                <p>{{ item.content }}</p>
              </div>
            </div>
          </div>
          <div
            v-else
            class="nothing"
          >
            <p>暂无评论</p>
          </div>
        </div>
      </scroll>
      <div class="but">
        <my-button
          v-if="state.status==='等待你的提交'||state.status==='撤回'"
          round
          type="default"
          size="small"
          style="padding: 0 5px"
          @click="onSubmitReview"
        >
          提交申请
        </my-button>
        <my-button
          v-if="state.status==='提交成功'"
          round
          type="danger"
          size="small"
          style="padding: 0 5px"
          @click="onCancelDrift"
        >
          撤销申请
        </my-button>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {ref, reactive, toRef, watch} from 'vue'
import Head from '../components/head'
import {Icon, Image, Rate, Button} from 'vant'
import Scroll from '../components/scroll'
import {getGoodByGid} from '../api/goods'
import {getCommentByGid} from '../api/comment'
import {checkDriftByid, createDriftFromHelper, cancalDriftByid} from '../api/drift'
import {createGoods} from '../model/good'
import {createComments} from '../model/comment'
import {noramlArray} from "../common/js/util";
import {success} from "../components/success";
import {fail} from "../components/fail";

const STEP = {
  0: {
    status: '等待你的提交',
    next: '提交成功',
    nextinfo: '请耐心等待用户的审核'
  },
  1: {
    status: '提交成功',
    next: '用户审核',
    nextinfo: '请耐心等待用户的审核'
  },
  2: {
    status: '用户审核通过',
    next: '物业领取',
    nextinfo: '等待物业通知您过来领取'
  },
  3: {
    status: '撤回',
    next: '提交审核',
    nextinfo: '等待你的再次提交'
  },
  4: {
    status: '用户决绝你的申请',
    next: '等待用户再次提交',
    nextinfo: '等待用户再次提交'
  },
  5: {
    status: '物品领取',
    next: '完成',
    nextinfo: '完成整个流程'
  },
  6: {
    status: '完成',
    next: '评论',
    nextinfo: '等待你的评论'
  },
  7: {
    status: '评论完成',
    next: '谢谢',
    nextinfo: '期待你的再次提交'
  }
}
const normalComment = noramlArray(createComments)
export default {
  components: {
    MyIcon: Icon,
    MyHead: Head,
    MyImage: Image,
    MyRate: Rate,
    Scroll: Scroll,
    MyButton: Button
  },
  props: {
    gid: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  setup(props) {
    const gid = toRef(props, 'gid')
    const data = reactive({
      good: '',
      user: ''
    })
    const comment = ref([])
    const state = reactive({
      status: '等待你的提交',
      next: '提交成功',
      nextinfo: '请耐心等待用户的审核'
    })

    function _getGoodByGid(gid) {
      getGoodByGid(gid).then(res => {
        data.good = createGoods(res.data)
        data.user = data.good.user
      })
    }

    function _getGoodComment(gid) {
      getCommentByGid(gid).then(res => {
        comment.value.push(...normalComment(res.data))
      })
    }

    function _checkDriftById(gid) {
      checkDriftByid(gid).then(res => {
        let pending = res.data.pending
        state.status = STEP[pending].status
        state.next = STEP[pending].next
        state.nextinfo = STEP[pending].nextinfo
      }).catch(() => {
        state.status = STEP[0].status
        state.next = STEP[0].next
        state.nextinfo = STEP[0].nextinfo
      })
    }

    watch(gid, (newValue) => {
      _getGoodByGid(newValue)
      _getGoodComment(newValue)
      _checkDriftById(newValue)
    })

    function onSubmitReview() {
      createDriftFromHelper(gid.value, data.good.name, data.user.id, 5).then(() => {
        success('提交成功')
        state.status = STEP[1].status
        state.next = STEP[1].next
        state.nextinfo = STEP[1].nextinfo
      }).catch(() => {
        fail('提交失败')
      })
    }

    function onCancelDrift() {
      cancalDriftByid(gid.value).then(() => {
        success('撤销成功')
        _checkDriftById(gid.value)
      })
    }

    return {
      data,
      comment,
      state,
      onSubmitReview,
      onCancelDrift
    }
  },
  data() {
    return {
      list: [1, 2, 3, 4, 5],
      visable: false
    }
  },
  methods: {
    onHide() {
      this.visable = false
    },
    onShow() {
      this.visable = true
    },
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.detail
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  bgColor(background_color_main)
  z-index 100

  &.detail-enter-from, &.detail-leave-to
    transform: translateX(100%)

  &.detail-enter-active, &.detail-leave-active
    transition: all 0.3s

  .scroll
    position fixed
    top 3rem
    left 0
    bottom 3rem
    right 0
    overflow hidden

    .head
      width: 100%;
      height: 80px;
      background-color: $color-theme
      display: flex;
      align-items: center;
      color: white;

      .status
        width 50%
        font-size $font-size-large
        text-align center

      .icon
        flex 1
        text-align center

    .next
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      bgColor(background_color_minor)

      p
        height: 20px;
        margin-left: 50px;
        fontColor(font_color_minor)
        font-size: $font-size-small

      p.title
        color #E6A23C;
        font-size $font-size-medium

    .good
      width: 100%;
      height: 100px;
      bgColor(background_color_minor)
      display: flex;
      align-items: center;
      margin-top: 15px;
      margin-bottom: 15px;
      padding: 20px;

      .content
        font-size: $font-size-large
        margin-left: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        width: 200px;

    .user
      width: 100%;
      height: 100px;
      bgColor(background_color_minor)
      display: flex;
      flex-direction: column;
      padding: 20px;
      color: #909399;
      font-size: $font-size-small

      .title
        width: 100%;
        color: $color-theme
        font-size: $font-size-large

      .star
        display flex
        align-items center

    .comment
      bgColor(background_color_minor)
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-top: 15px;
      padding: 20px;

      .title
        color: $color-theme;
        font-size: $font-size-large;

      .item
        display: flex;
        min-height: 100px;
        flex-direction: column;
        fontColor(font_color_minor)
        margin-top: 15px;
        font-size: $font-size-medium

        .use
          display: flex;
          align-items: center;
          height: 40px;

          .name
            height: 40px;
            flex: 1;
            line-height: 40px;
            margin-left: 10px;

        .starAndTime
          height: 24px;
          display: flex;
          justify-content: space-between;

        .content
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;

      .nothing
        width: 100%;
        height: 40px;
        text-align: center;
        color: #909399;

  .but
    width 100%
    height 3rem
    bgColor(background_color_minor)
    position fixed
    bottom 0
    left 0
    display flex
    justify-content flex-end
    align-items center
    padding-right 20px
</style>