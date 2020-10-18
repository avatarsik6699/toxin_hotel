const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

// helper functions----------------------------------------------------------
const optimization = () => {
    const config = {   
        // splitChunks: {
        //     chunks: 'all',
        // }
      }
    if (isProd) {
        config.minimizer = [
            new UglifyJsPlugin(),
            new CssMinimizerPlugin({
                exclude: /node_modules/,
            }),
        ]
    }
    return config;
}
const filename = ext => isDev ? `[name]/bundle.${ext}` : `[name]/bundle.[hash].${ext}`;
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
const pugEntries = {
    'cards': './src/UI_kit/cards/cards',
    'colors-type': './src/UI_kit/colors-type/colors-type',
    'form-elements': './src/UI_kit/form-elements/form-elements',
    'headers-footers': './src/UI_kit/headers-footers/headers-footers',
    'landing-page': './src/website_pages/landing-page/landing-page',
    'room-page': './src/website_pages/room-page/room-page',
    'search-room': './src/website_pages/search-room/search-room',
    'registration': './src/website_pages/registration/registration',
    'signin': './src/website_pages/signin/signin',
}

const htmlTemplates = Object.entries(pugEntries).map( entry => {
    return new HtmlWebpackPlugin({
        template: `${entry[1]}.pug`,
        chunks: [entry[0], "assets/shared"],
        filename: `${entry[0]}/index.html`,
        removeComments: isProd,
        collapseWhiteSpace: isProd,
    })
})


// loaders-----------------------------------------------------------
const sass = {
    test: /\.(css|sass|scss)$/i,
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
        { loader: 'postcss-loader', options: { sourceMap: true } },
        { loader: 'resolve-url-loader' },
        { loader: 'sass-loader', options: {sourceMap: true} },
        ],
};

const pug = {
    test: /\.pug$/,
    include: path.resolve(__dirname, 'src/'),
    loaders: [{
        loader: 'pug-loader',
        options: {
            root: path.resolve(__dirname, 'src/'),
        }
    }],
};

const files =  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: "images",
                filename: "[name].[ext]",
                publicPath: "./../images"
            }
        }
    ]
};

const fonts =  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [{
        loader: 'file-loader',
        options: {
            name: '[name].[ext]',
            outputPath: "fonts",
            publicPath: "./../fonts"
        }
    }],
};

const js =  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: jsLoader(),
};

// module description----------------------------------------
module.exports = {
    mode: 'development',
    entry: {...pugEntries},
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: isDev ?'source-map' : false,
    resolve: {
      extensions: ['.js', '.css', '.scss', '.sass', '.pug'],
      alias: {
        FEcomponents: path.resolve(__dirname, 'src/UI_kit/form-elements/components'),
        HFcomponents: path.resolve(__dirname, 'src/UI_kit/headers-footers/components'),
        CardsComponents: path.resolve(__dirname, 'src/UI_kit/cards/components'),
        WP: path.resolve(__dirname, 'src/website_pages'),
        root: path.resolve(__dirname, 'src/'),
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
            js,
        ]
    },
    plugins: [
        new webpack.ProvidePlugin( {
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        } ),
        new CleanWebpackPlugin(),
        ...htmlTemplates,
        new HtmlWebpackPlugin({
            template: `./src/index.pug`,
            filename: `index.html`,
            removeComments: isProd,
            collapseWhiteSpace: isProd,
        }),
        new MiniCssExtractPlugin({
            filename: isProd ? '[name]/styles.[contenthash].css' : '[name]/styles.css',
        }),
        new FaviconsWebpackPlugin({
            logo: './src/logo.svg',
            publicPath: './../favicons',
            outputPath: 'favicons',
            prefix:'',
            inject: true,
        })
    ],
    optimization: optimization(),
};