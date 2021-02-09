class User{
    constructor(data) {
        this.uid = data.id
        this.account = data.account
        this.nickname = data.nickname?data.nickname: '无'
        this.room = `${data.building} - ${data.unit} - ${data.room}`
        this.phone = data.mobile ? data.mobile : '空'
        this.email = data.email ? data.email: '空'
        this.logo = data.image ? data.image : 'https://img.yzcdn.cn/vant/cat.jpeg'
        this.you_are = data.you_are
        this.star = data.star
        this.count = data.count
        this.goods = data.goods
        this.wishes = data.wishes
        this.comment = data.comment
        // 他人求助
        this.helps = data.helps
    }
}
export function createUser(data) {
    return new User(data)
}