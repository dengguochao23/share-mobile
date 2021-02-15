<template>
  <div
    class="welcome"
  >
    <img
      style="width: 7rem;height: 7rem;border-radius: 50%"
      :src="require('../common/img/logo.png')"
      alt=""
      class="logo"
    >
    <p @click="onClick">
      7享网
    </p>
    <my-field
      v-model="state.account"
      label="邮箱"
      :show-error="true"
      :center="true"
      :error-message="state.errAccout"
      :clearable="true"
      label-align="center"
      style="width: 70%;min-height: 3rem;border-radius: 1.5rem;padding-right: 0.8rem !important;"
    />
    <my-field
      v-model="state.secret"
      label="密码"
      :type="showPasswordOrNumber"
      :show-error="true"
      :center="true"
      :clearable="true"
      label-align="center"
      :right-icon="showPasswordIcon"
      :error-message="state.errSecret"
      style="width: 70%;min-height: 3rem;border-radius: 1.5rem;margin-top: 1rem;"
      @click-right-icon="isShowPassword"
    />
    <my-button
      type="primary"
      size="large"
      round
      class="but"
      @click="onsubmit(state)"
    >
      登陆 / 注册
    </my-button>
  </div>
</template>

<script type="text/ecmascript-6">
import {Button, Field} from 'vant'
import {reactive, watch} from 'vue'
import {mapActions} from 'vuex'
import {checkUser} from '../api/user'
import {registers} from '../api/client'
import {loading} from '../components/loading'
import {fail} from '../components/fail'
export default {
  components: {
    myButton: Button,
    myField: Field,
  },
  setup() {
    const state = reactive({
      account: '',
      secret: '',
      errAccout: '',
      errSecret: ''
    })
    watch(state, (newVal) => {
      if (!isEmail(newVal.account)) {
        state.errAccout = '请输入正确的邮箱地址'
      } else {
        state.errAccout = ''
      }
      if (newVal.secret.length < 6) {
        state.errSecret = '请输入6位数的密码'
      } else {
        state.errSecret = ''
      }
    })

    function isEmail(value) {
      const reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
      return reg.test(value);
    }

    return {
      state
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    showPasswordOrNumber() {
      return this.isShow ? 'number' : 'password'
    },
    showPasswordIcon() {
      return this.isShow ? 'eye-o' : 'closed-eye'
    }
  },
  methods: {
    onsubmit(state) {
      let info = {
        account: state.account,
        nickname: state.account,
        build: 1,
        unit: 1,
        room: 1,
        secret: state.secret,
        type: 100
      }
      loading()
      checkUser('account', info.account).then(() => {
        this._login(info)
      }).catch(() => {
        registers(info.account, info.secret, info.type, info.build, info.unit, info.room, info.nickname).then(() => {
          this._login(info)
        })
      })
    },
    _login(info) {
      this.toLogin(info).then(() => {
        this.$router.push('/')
      }).catch(() => {
        fail('密码错误')
      })
      loading.close()
    },
    isShowPassword() {
      this.isShow = !this.isShow
    },
    onClick() {
      let dom = document.querySelector('#app')
      dom.setAttribute('data-theme', 'dark')
    },
    ...mapActions([
      'toLogin'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import "../common/stylus/index.styl";

.welcome
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  bgColor(background_color_main)
  .logo
    margin-bottom: 1rem;
    margin-top: 5rem;
    bgColor(background_color_minor)

  p
    margin-bottom: 2rem;
    font-size: 2rem;
    color: $color-theme;
  p:last-child
    font-size: 1rem;
    margin-top: 1rem;

  .but
    margin-top: 3rem;
    width: 70%
</style>