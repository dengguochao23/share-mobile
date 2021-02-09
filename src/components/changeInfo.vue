<template>
  <transition name="info">
    <div
      v-if="visible"
      class="detail"
    >
      <my-head @back="onClose" />
      <section>
        <div v-if="type==='email'">
          <my-field
            ref="field"
            v-model="state.email"
            label="邮箱"
            :show-error="true"
            :center="true"
            :clearable="true"
            :error-message="state.error"
            label-align="center"
            class="item"
            style="width: 100%;min-height: 3rem;padding-right: 0.8rem !important;"
          />
        </div>
        <div v-if="type==='nickname'">
          <my-field
            ref="field"
            v-model.number="state.nickname"
            label="昵称"
            :show-error="true"
            :center="true"
            :clearable="true"
            :error-message="state.error"
            label-align="center"
            class="item"
            style="width: 100%;min-height: 3rem;padding-right: 0.8rem !important;"
          />
        </div>
        <div v-if="type==='tel'">
          <my-field
            v-model.number="state.tel"
            type="number"
            label="电话"
            :show-error="true"
            :center="true"
            :clearable="true"
            :error-message="state.error"
            label-align="center"
            class="item"
            maxlength="11"
            style="width: 100%;min-height: 3rem;padding-right: 0.8rem !important;"
          />
        </div>
        <div v-if="type==='room'">
          <my-field
            ref="field"
            v-model="state.building"
            type="number"
            label="单元"
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
            v-model="state.unit"
            type="number"
            label="栋"
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
            v-model="state.room"
            type="number"
            label="房号"
            :show-error="true"
            :center="true"
            :clearable="true"
            :error-message="state.error"
            label-align="center"
            class="item"
            style="width: 100%;min-height: 3rem;padding-right: 0.8rem !important;"
          />
        </div>
      </section>
      <my-button
        type="primary"
        size="large"
        class="but"
        @click="onSubmit(state)"
      >
        保存
      </my-button>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {Button, Field} from 'vant'
import {success} from "../components/success";
import {fail} from "../components/fail";
import Head from '../components/head'
import {reactive, watch, toRef, ref} from 'vue'
import {saveUserByEmail, saveUserByRoom, saveUserByMobile} from '../api/user'
import {mapActions} from 'vuex'
export default {
  components: {
    MyButton: Button,
    MyField: Field,
    MyHead: Head
  },
  props: {
    type: {
      type: String,
      default() {
        return ''
      }
    }
  },
  setup(props) {
    let state = ref('')
    const type = toRef(props, 'type')
    watch(type, (newVal) => {
      state.value = typeOf(newVal)
    })

    function typeOf(type) {
      if (type === 'email') {
        return validateEmail()
      }
      if (type === 'nickname') {
        return validateNickname()
      }
      if (type === 'tel') {
        return validateTel()
      }
      if (type === 'room') {
        return validateRoom()
      }
    }

    function validateEmail() {
      const data = reactive({
        email: '',
        error: ''
      })
      watch(data, (newVal) => {
        if (!isEmail(newVal.email)) {
          data.error = '请输入正确的邮箱地址'
        } else {
          data.error = ''
        }
      })
      const isEmail = (val) => {
        const reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
        return reg.test(val)
      }
      return data
    }

    function validateNickname() {
      const data = reactive({
        nickname: '',
        error: ''
      })
      return data
    }

    function validateTel() {
      const data = reactive({
        tel: '',
        error: ''
      })
      const isTel = (val) => {
        const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        return reg.test(val)
      }
      watch(data, (newVal) => {
        if (!isTel(newVal.tel)) {
          data.error = '请输入正确的手机号码'
        } else {
          data.error = ''
        }
      })
      return data
    }

    function validateRoom() {
      const data = reactive({
        building: '',
        unit: '',
        room: '',
        error: ''
      })
      return data
    }
    return {
      state
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    onSubmit(state) {
      if (this._validate(state) || state.error.length > 0) {
        fail()
      } else {
        if (state.tel) {
          this._promiseFn(saveUserByMobile(state.tel))
        }
        if (state.email) {
          this._promiseFn(saveUserByEmail(state.email))
        }
        if (state.building) {
          let data = {
            'building': state.building,
            'unit': state.unit,
            'room': state.room
          }
          this._promiseFn(saveUserByRoom(data))
        }
      }
    },
    _promiseFn(fn) {
      fn.then(() => {
        success()
        this.getUser()
        this.onClose()
      }).catch(() => {
        fail()
      })
    },
    _validate(data) {
      for (let i in data) {
        let d = data[i]
        if (i !== 'error') {
          if (d.length < 1) {
            return true
          }
        }
      }
    },
    onShow() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    ...mapActions([
        'getUser'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.detail
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  bgColor(background_color_main)
  display flex
  flex-direction column

  &.info-enter-from, &.info-leave-to
    transform: translateX(100%)

  &.info-enter-active, &.info-leave-active
    transition: all 0.3s

  section
    flex 1

    .item
      background-color: $color-theme

  .but
    width 100%
    height 3rem
</style>