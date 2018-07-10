const path = require('path')
const webpack = require('webpack')

// input and output
const ENTRY_FILE = {
  index: path.resolve(__dirname, 'src', 'index.ts'),
  demo: path.resolve(__dirname, 'src', 'demo.ts')
}
const OUTPUT_DIR = path.resolve(__dirname, 'dist')
const OUTPUT_FILENAME = '[name].js'

// mode
const MODE = 'development'

// extensions
const RESOLVE_EXTS = ['.ts', '.js', '.json']

// rules
const RULES = [
  { test: /\.ts$/, loader: 'awesome-typescript-loader' },
  { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
]

// html page title for html webpack plugin
const PAGE_TITLE = {
  index: 'info'
}

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PLUGINS = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    title: PAGE_TITLE.index
  }),
  new webpack.HotModuleReplacementPlugin()
]

// options for webpack-dev-server
const DEV_SRV_OPTS = {
  port: 9000,
  contentBase: OUTPUT_DIR,
  compress: true,
  open: true,
  overlay: true,
  hot: true
}

// externals
const EXTERNALS = {}

module.exports = {
  entry: ENTRY_FILE,
  output: {
    filename: OUTPUT_FILENAME,
    path: OUTPUT_DIR
  },
  mode: MODE,
  devtool: 'source-map',
  resolve: { extensions: RESOLVE_EXTS },
  module: { rules: RULES },
  externals: EXTERNALS,
  plugins: PLUGINS,
  devServer: DEV_SRV_OPTS
}
