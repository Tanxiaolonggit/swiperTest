module.exports = {
  publicPath:'./',
    lintOnSave:false,  // 关闭eslint
    css: {
        loaderOptions: {
          postcss: {
            plugins: [
              require("postcss-px-to-viewport")({
                unitToConvert: "px",
                viewportWidth: 750,
                unitPrecision: 3,
                propList: [
                  "*"
                ],
                viewportUnit: "vw",
                fontViewportUnit: "vw",
                selectorBlackList: [],
                minPixelValue: 1,
                mediaQuery: false,
                replace: true,
                exclude: /(\/|\\)(node_modules)(\/|\\)/,
              })
            ]
          }
        }
    }
}