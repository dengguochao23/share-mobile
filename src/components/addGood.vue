<template>
  <transition name="addgood">
    <div
      v-if="visable"
      class="add"
    >
      <my-head
        :title="'加货品'"
        @back="onShow"
      />
      <section>
        <my-field
          ref="field"
          v-model="state.type"
          type="text"
          label="货品类型"
          :readonly="true"
          :show-error="true"
          :center="true"
          :clearable="true"
          :error-message="state.error"
          label-align="center"
          class="item"
          style="width: 100%;min-height: 3rem;padding-right: 0.8rem !important;"
          @click="openPicker"
        />
        <my-field
          ref="field"
          v-model="state.name"
          type="text"
          label="货品名称"
          :show-error="true"
          :center="true"
          :clearable="true"
          :error-message="state.error"
          label-align="center"
          class="item"
          style="width: 100%;min-height: 3rem;padding-right: 0.8rem !important;"
        />
        <my-field
          ref="field"
          v-model="state.specification"
          type="text"
          label="货品规格"
          :show-error="true"
          :center="true"
          :clearable="true"
          :error-message="state.error"
          label-align="center"
          class="item"
          style="width: 100%;min-height: 3rem;padding-right: 0.8rem !important;"
        />
        <my-field
          ref="field"
          v-model="state.detail"
          type="text"
          label="货品详情"
          :show-error="true"
          :center="true"
          :clearable="true"
          :error-message="state.error"
          label-align="center"
          class="item"
          style="width: 100%;min-height: 3rem;padding-right: 0.8rem !important;"
        />
      </section>

      <my-button
        type="primary"
        size="large"
        class="but"
        @click="onSubmit(state)"
      >
        保存
      </my-button>

      <popup
        v-model="showPopup"
      >
        <picker
          :picker-data="pickerData"
          :title="'物品类别'"
          @cancel="openPicker"
          @confirm="onSelect"
        />
      </popup>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Head from '../components/head'
import {reactive} from 'vue'
import {Button, Field} from "vant";
import Picker from '../components/picker'
import {addMyGood} from '../api/goods'
import { success } from "../components/success";
import Popup from '../components/popup'
export default {
  components: {
    MyHead: Head,
    MyButton: Button,
    MyField: Field,
    Picker: Picker,
    Popup: Popup,
  },
  setup() {
    const state = reactive({
      name: '',
      specification: '',
      detail: '',
      type: '',
      sid: '',
      cid: '',
      error: ''
    })
    return {
      state
    }
  },
  data() {
    return {
      showPopup: false,
      visable: false,
      pickerData: JSON.parse(window.localStorage.getItem('subs'))
    }
  },
  methods: {
    onShow() {
      this.visable = !this.visable
    },
    openPicker() {
      this.showPopup = !this.showPopup
    },
    onSelect(e) {
      this.state.type = `${e[0].label}  /  ${e[1].label}`
      this.state.cid = e[0].value
      this.state.sid = e[1].value
      this.openPicker()
    },
    onSubmit() {
      let good = {
        sid: this.state.sid,
        cid: this.state.cid,
        name: this.state.name,
        specification: this.state.specification,
        detail: this.state.detail
      }
      addMyGood(good).then(() => {
        success()
        this.onShow()
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.add
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height 100%
  bgColor(background_color_main)
  display flex
  flex-direction column

  &.addgood-enter-from, &.addgood-leave-to
    transform: translateX(100%)

  &.addgood-enter-active, &.addgood-leave-active
    transition: all 0.3s

  section
    flex 1
</style>