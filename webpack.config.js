const path = require('path')

module.exports = {
    entry: './index.mjs',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './docs')
    }
}