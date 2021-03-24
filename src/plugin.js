// 收集在文档中所有插件
const collectPlugins = require.context('./plugin', true, /.vue$/)

export const createAPI = (app) => {
    collectPlugins.keys().forEach(file_name => {
        // 拿到每个组件的name值，这要求每个组件都要设置name
        let fileName = collectPlugins(file_name).default.name
        // 检测组件内是否有命名name
        if (fileName===undefined ||fileName === '' ){
            throw '请设置组件的名字'
        }
        // 检测组件内的名字是否与组件的命名是否一致
        if (file_name.match(/([A-Za-z]+)/g)[0]!= fileName) {
            throw fileName + '组件里面的name与组件命名不一致'
        }
        let fn = collectPlugins(file_name)[fileName]
        let api = '$' + fileName
        app.config.globalProperties[api] = fn
    })
}