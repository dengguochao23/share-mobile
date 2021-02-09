import * as types from './mutation-type'
import { login } from '../api/login'
import instance from '../api/base'
import { getUserInfo } from '../api/user'
import {createUser } from '../model/user'
export const toLogin = function ({ commit }, info) {
  return new Promise((resolve, reject) => {
    login(info).then((res) => {
      if (res.status === 200) {
        let token = res.data.token
        commit(types.TOKEN, token)
        window.localStorage.setItem('token', token)
        instance.defaults.headers.common['Authorization'] = `Bearer ` + token
        resolve(token)
      }
    }).catch((error) => {
      let responseText = JSON.parse(error.request.responseText)
      reject(responseText)
    })
  })
}

export const getUser = function ({ commit }) {
  return new Promise((resolve, reject) => {
    getUserInfo().then((res) => {
      if (res.status === 200) {
        let userinfo = res.data
        commit(types.USERINFO, createUser(userinfo))
        resolve(userinfo)
      }
    }).catch((error) => {
      let responseText = JSON.parse(error.request.responseText)
      reject(responseText)
    })
  })
}

export const updateUser = function ({ commit }) {
  getUserInfo().then((res) => {
    if (res.status === 200) {
      let userinfo = res.data
      commit(types.USERINFO, userinfo)
    }
  })
}

export const logOut = function ({ commit }) {
  window.localStorage.clear()
  commit(types.USERINFO, {})
}

export const addShop = function ({ commit, state }, shop) {
  let currentShop = state.myShop.slice()
  commit(types.MYSHOP, [])  // 因为vuex不能外部修改store里面的值，所以只能将其清空
  let sameforshopofIndex = currentShop.findIndex((s) => {
    return s.id === shop.id
  })
  if (sameforshopofIndex >= 0) {
    let current = currentShop[sameforshopofIndex] // 拿到当前物品
    let num = current.num
    num++
    current.num = num
  } else {
    currentShop.push(shop)
  }
  commit(types.MYSHOP, currentShop)
}
export const cleanShop = function ({ commit }) {
  commit(types.MYSHOP, [])
}
export const cutShop = function ({ commit, state }, shop) {
  let currentShop = state.myShop.slice()
  commit(types.MYSHOP, [])  // 因为vuex不能外部修改store里面的值，所以只能将其清空
  let sameforshopofIndex = currentShop.findIndex((s) => {
    return s.id === shop.id
  })
  if (sameforshopofIndex >= 0) {
    let current = currentShop[sameforshopofIndex] // 拿到当前物品
    let num = current.num
    num--
    if (num < 1) {
      currentShop.splice(sameforshopofIndex, 1)
    } else {
      current.num = num
    }
  }
  commit(types.MYSHOP, currentShop)
}

export const deleteShop = function ({ commit, state }, index) {
  let currentShop = state.myShop.slice()
  currentShop.splice(index, 1)
  commit(types.MYSHOP, currentShop)
}
