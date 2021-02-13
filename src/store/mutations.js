import * as types from './mutation-type'

const mutations = {
  [types.TOKEN]: (state, token) => {
    state.token = token
  },
  [types.USERINFO]: (state, info) => {
    state.userInfo = info
  },
  [types.MYSHOP]: (state, myShop) => {
    state.myShop = myShop
  },
  [types.DARKMODE]: (state, darkMode) => {
    state.darkMode = darkMode
  }
}

export default mutations
