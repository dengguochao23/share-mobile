import instance from './base'

// 拿到所有子目录和主目录
export function getAllSubs () {
  return instance.get(`/goods/get/subs`)
}
export function getContents () {
  return instance.get('goods/get/content')
}

export function addMyGood (good) {
  instance.defaults.auth = { username: window.localStorage.getItem('token') }
  return instance.post('/goods/add/good', {
    'cid': good.cid,
    'sid': good.sid,
    'name': good.name,
    'specification': good.specification,
    'detail': good.detail
  })
}

export function getGoodByGid (gid) {
  instance.defaults.auth = { username: window.localStorage.getItem('token') }
  return instance.post('/goods/get/good', {
    'gid': gid
  })
}

export function getMyGoods (page) {
  instance.defaults.auth = { username: window.localStorage.getItem('token') }
  return instance.get(`goods/get/mygood/page=${page}`)
}
export function getGoodsByUid (uid) {
  return instance.get(`/goods/get/uid=${uid}`)
}

export function upDataMyGood (good) {
  instance.defaults.auth = { username: window.localStorage.getItem('token') }
  return instance.post('/goods/update/good', {
    'gid': good.gid,
    'specification': good.specification,
    'detail': good.detail
  })
}
// 10代表取消，11代表生效，12代表删除
export function handleMyGood (gid, type) {
  instance.defaults.auth = { username: window.localStorage.getItem('token') }
  return instance.post(`/goods/handle/good`, {
    'gid': gid,
    'type': type
  })
}
