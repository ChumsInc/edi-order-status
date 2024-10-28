import path from 'node:path';
import process from 'node:process';


export default {
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
    ],
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                common: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    chunks: "all",
                    name: "vendor_common",
                    minSize: 0,
                },
                // we are opting out of defaultVendors, so rest of the node modules will be part of default cacheGroup
                defaultVendors: false,
                reactPackage: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|@remix-run|@reduxjs|redux|react-redux|reselect|immer|react-error-boundary)[\\/]/,
                    name: 'vendor_react',
                    chunks: "all",
                    priority: 10,
                },
                chums: {
                    test: /[\\/]node_modules[\\/]chums.*[\\/]/,
                    name: 'chums',
                    chunks: "all",
                    priority: 10,
                },
                default: {
                    minChunks: 2,
                    priority: 20,
                    reuseExistingChunk: true,
                }
            }
        }
    },
    output: {
        path: path.join(process.cwd(), 'public/js'),
        filename: "[name].js",
        sourceMapFilename: '[file].map',
        publicPath: '/',
    },
    target: 'web',
}
