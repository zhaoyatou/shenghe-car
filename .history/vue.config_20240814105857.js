const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}
// www.bjshqcyb.com
// bjshqcyb.com

const isProd = process.env.NODE_ENV === 'production';

// const { VueCDN, AxiosCDN, VueRouterCDN, VuexCDN } = require('./src/plugins/cdn');

// const cdn = {
//   css: [],
//   js: [VueCDN, AxiosCDN, VueRouterCDN, VuexCDN],
//   externals: {
//     vue: 'Vue',
//     'vue-router': 'VueRouter',
//     vuex: 'Vuex',
//     axios: 'axios'
//   }
// };

module.exports = {
  configureWebpack: {
    resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'tslint-loader'
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          }
        }
      ]
    }
  },
  productionSourceMap: false,
  outputDir: 'dist',
  publicPath: './',
  lintOnSave: false,
  devServer: {
    port: 8999,
    open: true,
    // proxy: {
    //   '/api': {   //看到请求路径中如果有/api这样的字段  会将这个字段自动转接到target
    //     target: 'https://47.94.241.160/',//目标源
    //     changeOrigin: true,//允许跨域了
    //     pathRewrite: {
    //       '/api': ' '//路径重写
    //     }
    //   },
    // },
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    // before: !isProd ? require('./mock/mock-server.js') : ''
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/styles/variables.scss";`
      }
    },

  },

  configureWebpack: {
    name: process.env.VUE_APP_BASE_NAME,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: isProd ? {} : {}
  },
  chainWebpack(config) {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    // 设置svg
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
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
      .end();

    //设置开发环境sourceMap
    config.when(!isProd, config => config.devtool('cheap-source-map'));
    //生产环境
    config.when(isProd, config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          commons: {
            name: 'chunk-commons',
            test: /[\\/]src[\\/]js[\\/]/,
            minChunks: 2, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });

      // config.plugin('html').tap(args => {
      //   args[0].cdn = cdn;
      //   return args;
      // });

      config.optimization.runtimeChunk('single');

      //去除生产环境debugger 和console
      config.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions.compress.warnings = false;
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        args[0].terserOptions.compress.pure_funcs = ['console.*'];
        return args;
      });
      //g-zip开启
      // config.plugin('CompressionWebpackPlugin').use(CompressionWebpackPlugin, [
      //   {
      //     filename: '[path].gz[query]',
      //     algorithm: 'gzip',
      //     test: /\.js$|\.css/, //匹配文件名
      //     threshold: 10240, //对超过10k的数据压缩
      //     minRatio: 0.8
      //   }
      // ]);
      //打包大小分析
      if (process.env.npm_config_report) {
        config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
      }
    });
  }
};
