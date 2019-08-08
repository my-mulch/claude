const path = require('path')

module.exports = {
    entry: './develop/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './develop')
    }
}