const path = require('path');

module.exports = {
  // Entry point of your app
  entry: './src/index.js',

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.mjs', '.ts', '.tsx'], // Ensure .js is included
  },

  // Add this line to enable verbose logging during Webpack build
  stats: 'verbose',  // This will print detailed information about module resolution

  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Your middleware setup here
      return middlewares;
    },
  },

  // Other Webpack configurations (like output, loaders, plugins, etc.)
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
