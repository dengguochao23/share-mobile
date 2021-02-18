import {createRouter, createWebHistory} from 'vue-router'
import store from '../store/index'
import Error from '../common/js/error'

const Main = () => import(/* webpackChunkName: "main" */ '../pages/main')
const Home = () => import(/* webpackChunkName: "home" */ '../pages/home')
const NotFound = () => import(/* webpackChunkName: "not-found" */ '../pages/notFound')
const Welcome = () => import(/* webpackChunkName: "login" */ '../pages/welcome')
const Drift = () => import(/* webpackChunkName: "drift" */ '../pages/drift')
const AskForHelp = () => import(/* webpackChunkName: "ask" */ '../pages/askForHelp')
const Shop = () => import(/* webpackChunkName: "shop" */ '../pages/shop' )
const Hot = () => import(/* webpackChunkName: "hot" */ '../pages/hot')
const Use = () => import(/* webpackChunkName: "hot" */ '../pages/use')
const error = new Error()

// 只有在生产环境的时候才进行错误监控
if (process.env.NODE_ENV === 'production') {
    error.init()
}
const base = process.env.NODE_ENV === 'production' ? '/mobile/' : '/'
const router = createRouter({
    history: createWebHistory(base),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: NotFound,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/',
            component: Main,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/drift',
            name: 'drift',
            component: Drift,
            // redirect: '/drift',
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/ask',
            name: 'ask',
            component: AskForHelp,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/shop',
            name: 'shop',
            component: Shop,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/hot',
            name: 'hot',
            component: Hot,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/hot/use/:uid',
                    name: 'use',
                    components: {
                        hotRouter: Use
                    },
                    props: {
                        hotRouter: true
                    },
                    meta: {
                        requiresAuth: true
                    }
                }
            ]
        },
        {
            path: '/welcome',
            name: 'welcome',
            component: Welcome
        }
    ]
})

router.beforeEach((to, from, next) => {
    let token = window.localStorage.getItem('token')
    if (to.meta.requiresAuth) {
        if (token) {
            store.dispatch('getUser').then(() => {
                next()
            }).catch(() => {
                store.dispatch('logOut').then(() => {
                    next({
                        name: 'welcome',
                        query: {
                            redirect: to.fullPath
                        }
                    })
                })
            })
        } else {
            store.dispatch('logOut').then(() => {
                next({
                    name: 'welcome',
                    query: {
                        redirect: to.fullPath
                    }
                })
            })
        }
    } else {
        next()
    }
    // 异常数据发送
    error.report()
})

export default router
