const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  mode: "development",

  entry: {
    index: "./index.js",
    indexedDb: "./indexedDb.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      inject: false,
      name: "Budget Tracker",
      short_name: "Budget",
      description: "Application that allows you to track your budget.",
      background_color: "#01579b",
      theme_color: "#ffffff",
      start_url: "/",
      icons: [
        {
          src: path.resolve("icons/icon-192x192.png"),
          sizes: [192, 512],
          destination: path.join("", "icons"),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
module.exports = config;
