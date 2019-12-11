const path = require('path');
const nodeExternals = require('webpack-node-externals');
// 服务端的webpack
module.exports = {
    target: 'node',
    mode: 'development', // 开发模式
    entry: './server/index.js', // 项目入口
    externals: [nodeExternals()], 
    output: { // 输出
        filename: 'bundle.js', // node编译输出文件 
        path: path.resolve(__dirname, 'build')
    },
    // 支持babel
    module: {
        rules:[
            {
                test:/\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets:['@babel/preset-react',['@babel/preset-env']]
                }
            }
        ]
    }
}