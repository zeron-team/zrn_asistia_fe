const path = require('path');

module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/, // Excluye toda la carpeta node_modules
      },
    ],
  },
};
