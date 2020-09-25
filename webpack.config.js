const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

// helper functions----------------------------------------------------------
const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;
const jsLoader = () => {
    const loaders = [{
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties'],
      },
    }];

    return loaders;
};

// loaders-----------------------------------------------------------
const sass = {
    test: /\.(css|sass)$/i,
    include: path.resolve(__dirname, 'src/'),
    use: [
        isDev 
        ? 'style-loader' 
        :
        { 
            loader: MiniCssExtractPlugin.loader, 
            options: {
                hmr: isDev,
                reloadAll: true,
            },
        },
        { loader: 'css-loader', options: {sourceMap: true} },
        { loader: 'resolve-url-loader' },
        { loader: 'sass-loader', options: {sourceMap: true} },
        ],
};

const pug = {
    test: /\.pug$/,
    include: path.resolve(__dirname, 'src/'),
    use: ["pug-loader"]
};

const files =  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: "img",
                filename: "[name].[ext]",
            }
        }
    ]
};

const fonts =  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: ['file-loader'],
};

const js =  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: jsLoader(),
};

// module description----------------------------------------
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: ['@babel/polyfill', './index.js'],
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: isDev ? 'source-map' : false,
    resolve: {
      extensions: ['.js', '.css'],
      alias: {
        modules: path.join(__dirname, "node_modules"),
      }
    },
    devServer: {
        contentBase: './dist',
        hot: isDev,
        port: 3000
    },

    module: {
        rules: [
            sass,
            pug,
            files,
            fonts,
            js
        ]
    },
    plugins: [
        new webpack.ProvidePlugin( {
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        } ),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.pug',
            removeComments: isProd,
            collapseWhiteSpace: isProd,
        }),
        new MiniCssExtractPlugin({
            filename: isProd ? "styles/[name].[contenthash].css" : "[name].css",
        }),
    ],
};