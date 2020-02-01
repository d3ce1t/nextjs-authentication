// webpack.config.js
const path = require('path');
module.exports = {
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    externals: {
        react: 'commonjs react',
        'next/router': 'commonjs next/router'
    },
};