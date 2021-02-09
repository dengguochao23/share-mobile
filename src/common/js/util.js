export function noramlArray (fn) {
  const wrapped = function (arg) {
    let temp = []
    arg.forEach((d) => {
      temp.push(fn(d))
    })
    return temp
  }
  return wrapped
}

export const performaceData = function () {
  // 开发模式无需进行性能监控
  if (process.env.NODE_ENV !== 'production') {
    return false
  }
  let performance = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance
  // 如果浏览器不支持，直接不执行以下操作
  if (performance === undefined) {
    return false
  }
  let timinObj = performance.timing
  let navigationObj = performance.navigation
  let params = {}
  // 如果是reload没必要去监控其的性能
  // 0 : TYPE_NAVIGATE (用户通过常规导航方式访问页面，比如点一个链接，或者一般的get方式)
  // 1 : TYPE_RELOAD (用户通过刷新，包括JS调用刷新接口等方式访问页面)
  // 2 : TYPE_BACK_FORWARD (用户通过后退按钮访问本页面)
  if (navigationObj.type === 0) {
    params.dns = Math.floor(timinObj.domainLookupEnd - timinObj.domainLookupStart) // dns查询时间
    params.tcp = Math.floor(timinObj.connectEnd - timinObj.connectStart) // tcp链接时间
    params.paint = Math.floor(timinObj.responseEnd - timinObj.responseStart) // request请求耗时
    params.render = timinObj.domComplete - timinObj.domInteractive // dom树解释时间
    params.domready = timinObj.domInteractive - timinObj.responseEnd // domready时间
    params.load = timinObj.loadEventEnd - timinObj.fetchStart // 首屏时间
    params.white = Math.floor(Date.now() - timinObj.navigationStart) // 白屏时间
    let args = ''
    // 拼成URL可以用的数
    for (let i in params) {
      if (args !== '') {
        args += '$$'
      }
      args += `${i}=${params[i]}`
    }
    // 解决跨域的问题
    let img = new Image(1, 1)
    let baseUrl = process.env.NODE_ENV === 'production' ? 'https://www.ifenghua.top/v1' : 'http://127.0.0.1:5000/v1'
    let src = baseUrl + '/performace' + `/${encodeURIComponent(args)}`
    setTimeout(() => {
      img.src = src
    }, 100)
  }
}

// 防抖
export function debounce (fun, ms = 1000) {
  let timer
  return function (...arg) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun.apply(this, arg)
    }, ms)
  }
}
