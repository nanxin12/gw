module.exports = {
  chainWebpack: config => {
    const imagesRule = config.module.rule('images')
    imagesRule
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  },
  publicPath: './',
  productionSourceMap: false,
  assetsDir: 'pc/static',
  indexPath: 'pcIndex.html'
}
