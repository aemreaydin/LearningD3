const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");


module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/app.js",
    output: {
        filename: "app.js"
    },
    resolve: {
        extensions: [".js"]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html"
        }),
        new webpack.ProgressPlugin()
    ]
};