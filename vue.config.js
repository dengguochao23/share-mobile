const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
    css: {
        loaderOptions: {
            less: {
                // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
                lessOptions: {
                    modifyVars: {
                        // 直接覆盖变量
                        // blue: '#1B91F3',
                        hack: `true; @import "src/common/stylus/vant.less";`,
                    },
                },
            },
        },
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/mobile/' : '/',
    configureWebpack: {
        plugins: [
            new webpack.ContextReplacementPlugin(
                /moment[/\\]locale$/,
                /zh-cn/
            ),
            new CompressionPlugin({
                test: /\.(js|css|html|svg)$/,
                threshold: 10240,
                minRatio: 0.8,
                algorithm: 'gzip'
            })
        ]
    }
};