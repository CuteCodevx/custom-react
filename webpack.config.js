// 新建的
const path = require('path');
module.exports = {
  entry: {
    app: './src/index.js'
  },
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/dist/' //定义了我们打包后的文件应该跑到哪个目录里
  },
  devServer: {
    contentBase: path.join(__dirname, 'public/'), //本地服务器所加载的页面所在的目录  为这个目录下的文件提供本地服务器
    //historyApiFallback: true,
    //colors: true,
    port: 8085, //设置监听端口
    inline: true, //源文件改变时会自动刷新页面
    hot: true //允许热加载
  },
  mode: 'development', // 设置mode
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx?$/, //js 和 .jsx
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules'), //打包除这个文件之外的文件
        include: path.resolve(__dirname, './src'), //打包包括的文件
        options: {
          presets: ['react'] //react 否则打包的时候不能识别return里的<
        }
      }
    ]
  }
  //plugins: [new webpack.HotModuleReplacementPlugin()]
};
