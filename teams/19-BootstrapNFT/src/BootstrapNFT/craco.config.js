const path = require("path");
const webpack = require("webpack");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: {
      resolve: {
        fallback: {
          util: require.resolve("util/"),
          buffer: require.resolve("buffer/"),
          stream: require.resolve("stream-browserify"),
          assert: require.resolve("assert/"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          os: require.resolve("os-browserify/browser"),
          url: require.resolve("url/"),
          crypto: require.resolve("crypto-browserify"),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      ],
    },
  },
};
