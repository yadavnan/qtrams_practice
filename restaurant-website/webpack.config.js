const path = require('path');

module.exports = {
  entry: './src/index.js', // Your entry file
  output: {
    filename: 'bundle.js',  // Output bundle name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Where to serve static files from
    },
    open: true, // Open the browser after server is started
    port: 8080, // Port to run the server on
  },
};
