const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

let isProd = process.env.NODE_ENV === "production"; //true or false
//In package json prod script, we need cross-env when working on windows to make the NODE_ENV=production flag work,
//if working on mac or linux then you only need

let cssDev = ["style-loader", "css-loader", "sass-loader"];
let cssProd = ExtractTextPlugin.extract(
                {
                    fallback : "style-loader", 
                    use : ["css-loader", "sass-loader"],
                    publicPath : path.resolve(__dirname, "dist")
                });

let cssConfig = isProd ? cssProd : cssDev;


const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    title : "Test App",
    template : "./public/index.html",
    inject : "body",
    minify: {
        collapseWhitespace : true
    }
});


module.exports = {
    entry : "./src/index.js",
    output : {
        path : path.resolve(__dirname, "dist"),
        filename : "bundle.js",
        publicPath: "/"
    },
    module: {
        rules : [
            {
                test: /\.scss$/,
                use : cssConfig
        
            },           
            {
                test: /\.(jp?g|png|gif|svg)$/i,
                use: ["url-loader?name=images/[name].[ext]"]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'url-loader?name=fonts/[name].[ext]'
            },
            { 
                test: /\.js$/, 
                use: {loader : "babel-loader"},   
                exclude: /node_modules/ 
            }
            
        ]

    },
    devServer : {
        contentBase : path.resolve(__dirname, "dist"),
        host: "localhost",
        compress: true,
        port: 3000,
        hot: true,
        stats: "errors-only",
        publicPath: '/',
        historyApiFallback: true,

        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                secure: true
            }
        }
    },
    plugins : [
        HtmlWebpackPluginConfig,
        new ExtractTextPlugin({
            filename: "css/[name].css",
            allChunks : true    
        }),
        new webpack.HotModuleReplacementPlugin(), // Enable HMR
        new webpack.NamedModulesPlugin()    
    ]
    
}


