import { createApp } from 'vue'
import router from "./route/router";
import store from "./store/index";
import {createAPI} from "./plugin";
import App from './App.vue'
const app = createApp(App)
app.use(router)
app.use(store)
createAPI(app)
// 设置主题模式
var dom = document.body.querySelector('#app')
dom.setAttribute('data-theme', 'light')

app.mount('#app')
