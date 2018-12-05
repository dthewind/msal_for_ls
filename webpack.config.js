var path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const WebpackShellPlugin = require('webpack-shell-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin')

var plugins = [];

// plugins.push(new CleanWebpackPlugin(path.resolve(__dirname, 'dist/')));

// plugins.push(new webpack.DefinePlugin({
//     NODE_ENV: JSON.stringify(process.env.NODE_ENV)
// }));

// plugins.push(new webpack.ProvidePlugin({
//     "$": "jquery",
//     "jQuery": "jquery"
// }));

plugins.push(new HtmlWebpackPlugin({
    template: './src/index.html'
}));

// plugins.push(new WebpackShellPlugin({
//     onBuildStart: ['echo "Starting"'],
//     onBuildEnd: ['echo "Stopping"']
// }));

var rules = [];

rules.push({
    test: /\.html$/,
    use: [{
        loader: 'html-loader'
    }]
});

// rules.push({
//     test: /\.(svg|eot|woff|woff2|ttf)$/,
//     use: [{
//         loader: 'file-loader'
//     }]
// });

// rules.push({
//     test: /\.less|.css$/,
//     use: [{
//         loader: 'style-loader' // creates style nodes from JS strings
//     }, {
//         loader: 'css-loader' // translates CSS into CommonJS
//     }, {
//         loader: 'less-loader', // compiles Less to CSS
//         options: {
//             paths: [
//                 path.resolve(__dirname, 'node_modules')
//             ]
//         }
//     }]
// });

module.exports = {
    entry: {
        'index': path.resolve(__dirname, 'src/index.js')
    },
    devtool: 'source-map',
    mode: 'development',
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve(__dirname, 'dist/'),
        devtoolLineToLine: true,
        pathinfo: true
    },
    devServer: {
        port: 4400,
        publicPath: '/',
        contentBase: path.resolve(__dirname, 'src')
    },
    module: {
        rules: rules
    },
    plugins: plugins
};