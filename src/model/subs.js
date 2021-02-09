import {getAllSubs} from '../api/goods'

export function createSubs () {
    if (window.localStorage.getItem('subs')) {
        return
    }
    getAllSubs().then((res) => {
        let subs = res.data
        let n = normalSubs(subs)
        window.localStorage.setItem('subs', JSON.stringify(n))
    })
}
function normalSubs (subs) {
    let s = []
    subs.forEach((sub) => {
        let content = sub.contents
        if (findContent(sub, s)) {
            let i = s.findIndex((item) => item.value === content.id)
            s[i].children.push({
                'value': sub.id,
                'label': sub.name
            })
        } else {
            let o = {
                'value': content.id,
                'label': content.name,
                'children': []
            }
            let c = {
                'value': sub.id,
                'label': sub.name
            }
            o.children.push(c)
            s.push(o)
        }
    })
    return s
}
function findContent (sub, current) {
    if (current.length === 0) {
        return false
    }
    let content = sub.contents
    for (let i = 0; i < current.length; i++) {
        let c = current[i]
        if (c.value === content.id) {
            return true
        }
    }
}