const path = require('path');

module.exports = {
  entry: './src',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: 'babel-loader' },
      {
        test: /\.s?css$/,
        use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  }
}
