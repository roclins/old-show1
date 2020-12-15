'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js'),
    proxy: {
      '/dev-api/test2': {
        // /api 的意义在于，声明axios中url已/api开头的请求都适用于该规则，
        // 注意是以/api开头，即：axios.post({url: '/api/xxx/xxx'})
        target: `http://localhost:3002`,
        // 此处target的意义在于：造成跨域是因为访
        // 问的host与我们的请求头里的origin不一致，所以我们要设置成一致，这个具体请看下文
        changeOrigin: true,
        pathRewrite: {
          '^/dev-api/test2': '/old-back/v1/user'
        }
        // 此处是大部分文章都不会明说的的地方，
        // 既然我们设置了代理，则所有请求url都已写成/api/xxx/xxx，那请求如何知道我们到底请求的是哪个服务器的数据呢
        // 因此这里的意义在于， 以 /api开头的url请求，代理都会知道实际上应该请求那里，
        // ‘我是服务器/api’，后面的/api根据实际请求地址决定，即我的请求url：/api/test/test，被代理后请求的则是
        // https://我是服务器/api/test/test
      },
      '/dev-api/test': {
        // /api 的意义在于，声明axios中url已/api开头的请求都适用于该规则，
        // 注意是以/api开头，即：axios.post({url: '/api/xxx/xxx'})
        target: `http://localhost:3001`,
        // 此处target的意义在于：造成跨域是因为访
        // 问的host与我们的请求头里的origin不一致，所以我们要设置成一致，这个具体请看下文
        changeOrigin: true,
        pathRewrite: {
          '^/dev-api/test': '/old-back/v1/admin'
        }
        // 此处是大部分文章都不会明说的的地方，
        // 既然我们设置了代理，则所有请求url都已写成/api/xxx/xxx，那请求如何知道我们到底请求的是哪个服务器的数据呢
        // 因此这里的意义在于， 以 /api开头的url请求，代理都会知道实际上应该请求那里，
        // ‘我是服务器/api’，后面的/api根据实际请求地址决定，即我的请求url：/api/test/test，被代理后请求的则是
        // https://我是服务器/api/test/test
      },
      '/oldlist/test': {
        target: `http://localhost:3001`,
        changeOrigin: true,
        pathRewrite: {
          '^/oldlist/test': '/old-back/v1/admin'
        }
      },
      '/device/test': {
        target: `http://localhost:3001`,
        changeOrigin: true,
        pathRewrite: {
          '^/device/test': '/old-back/v1/admin'
        }
      },

    },
    after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    devtool: 'source-map'
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
