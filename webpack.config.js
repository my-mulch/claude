const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, './index.mjs'),
    module: {
        rules: [{
            test: /\.mjs$/,
            exclude: [
                path.resolve(__dirname, './big-box/test/')
            ]
        }]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './docs')
    }
}