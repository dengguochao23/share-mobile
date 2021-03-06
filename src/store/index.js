import { createStore } from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// import createLogger from 'vuex/dist/logger'

const debug = process.env.NODE_ENV !== 'production'

const store = createStore({
  actions,
  getters,
  mutations,
  state,
  strict: debug,
  // plugins: debug ? [createLogger()] : []
})
export default store
