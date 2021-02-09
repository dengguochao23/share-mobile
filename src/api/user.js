import instance from './base'

export function getUserInfo() {
    instance.defaults.auth = {username: window.localStorage.getItem('token')}
    return instance.get(`/user`)
}

export function getAllUser(page) {
    instance.defaults.auth = {username: window.localStorage.getItem('token')}
    return instance.get(`/user/all/page=${page}`)
}

export function checkUser(type, name) {
    return instance.post(`/user/check/c=${type}`, {
        'name': name
    })
}

export function saveUserInfo(info) {
    return instance.post('/user/save/all', {
        'nickname': info.nickname,
        'building': info.building,
        'unit': info.unit,
        'room': info.room,
        'email': info.email,
        'mobile': info.mobile
    })
}

export function saveUserByRoom(data) {
    return instance.post('user/save/room', {
            'building': data.building,
            'unit': data.unit,
            'room': data.room
        })
}

export function saveUserByMobile(mobile) {
    return instance.post('user/save/mobile',{
        'mobile': mobile
    })
}

export function saveUserByEmail(email) {
    return instance.post('user/save/email',{
        'email': email
    })
}

export function saveUserByNickname(nickname) {
    return instance.post('user/save/nickname',{
        'nickname': nickname
    })
}
export function ranking () {
    return instance.get('user/ranking')
}