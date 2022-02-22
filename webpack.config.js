import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpackNodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';
import webpack from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { WebpackDevServerPlugin } from './WebpackDevServerPlugin.js';
import { WebpackDiskPlugin } from './WebpackDiskPlugin.js';

const __dirname = new URL('.', import.meta.url).pathname;

const isDevelopment = process.env.NODE_ENV === 'development';

console.log(process.env.NODE_ENV)
const baseConfig = {
    mode: isDevelopment ? "development" : "production",
    devtool: "cheap-module-source-map",
    module: {
        rules: [
          {
            type: "javascript/auto",
            resolve: {
                // Since we use ES modules, the import path must be fully specified. But this is not something Typescript
                // support, so the workaround is to not require extension in import path.
                // See https://github.com/webpack/webpack/issues/11467
                // See https://github.com/microsoft/TypeScript/issues/16577
                fullySpecified: false,
              },
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: [
                { loader: 'babel-loader'},
            ]
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: 'css-loader',
                options: { sourceMap: isDevelopment},
              },
            ],
          },
        ]
      }
}

const seed = {};

const vendorConfig = {
    name: 'vendor',
    mode: isDevelopment ? "development" : "production",
    mode: 'development',
    entry: {
        vendor: ['react', 'react-dom', 'react/jsx-runtime']
    },
    output: {
        filename: 'vendor.dll.js',
        path: path.join(__dirname, 'dist'),
        publicPath: isDevelopment ? 'http://localhost:3001/' : '/',
        library: 'vendor_lib'
    },
    plugins: [
        new webpack.DllPlugin({
            name: 'vendor_lib',
            path: path.join(__dirname, 'dist', 'vendor-manifest.json')
        }),
        new WebpackManifestPlugin({ seed }),
    ]
}

const clientConfig = {
    name: 'client',
    entry: {
        client: './index.client.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist', 'client'),
        filename: '[name].bundle.js',
        publicPath: isDevelopment ? 'http://localhost:3001/' : '/',
    },
    ...baseConfig,
    dependencies: ["vendor"],
    devServer: {
      watchFiles: ['/**/*.js', 'public/**/*'],
        hot: true,
        host: 'localhost',
        headers: { 'Access-Control-Allow-Origin': '*' },
        static: [{
            directory: path.resolve(__dirname, 'dist', 'client'),
            watch: false,
        }],
        port: 3001,
    },
    optimization:{
        // Keep runtime chunk minimal by enabling runtime chunk
        // See https://webpack.js.org/guides/build-performance/#minimal-entry-chunk
        runtimeChunk: true,
        // Avoid extra optimization step, turning off split-chunk optimization
        // See https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      },
    plugins: [
      isDevelopment && new WebpackDevServerPlugin(),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      new WebpackManifestPlugin({ seed }),
      new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: path.join(__dirname, 'dist', 'vendor-manifest.json')
        }),
      new HtmlWebpackPlugin({
          inject: 'body',
          template: 'index.html'
      }),
      new AddAssetHtmlPlugin({ filepath: path.resolve(__dirname, './dist/*.dll.js') }),
      new MiniCssExtractPlugin({ filename: 'styles.css' }),
      isDevelopment && new WebpackDiskPlugin({
        output: {
          path: "dist/client"
        },
        files: [
          { asset: "index.html" },
          { asset: "manifest.json" },
          { asset: "vendor.dll.js" },
        ]
      }),
    ].filter(Boolean)
}

const serverConfig = {
    name: 'server',
    entry: './index.server.js',
    output: {
        path: path.resolve(__dirname, 'dist', 'server'),
        filename: 'server.bundle.cjs',
    },
    target: 'node',
    resolve: {
        alias: {
            '@client': path.resolve(__dirname, 'dist', 'client'),
        }
    },
    dependencies: ['client'],
    externals: [webpackNodeExternals()],
    ...baseConfig,
    module: {
        rules: [
          {
            type: "javascript/auto",
            resolve: {
                // Since we use ES modules, the import path must be fully specified. But this is not something Typescript
                // support, so the workaround is to not require extension in import path.
                // See https://github.com/webpack/webpack/issues/11467
                // See https://github.com/microsoft/TypeScript/issues/16577
                fullySpecified: false,
              },
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: [
                { loader: 'babel-loader'},
            ]
          },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new NodemonPlugin({ ignore: ['*.css'], watch: [path.resolve('./dist/server/server.bundle.cjs')] }),
        new MiniCssExtractPlugin({ filename: 'styles.css' }),
    ]
}

export default [
    vendorConfig,
    clientConfig,
    serverConfig
]
