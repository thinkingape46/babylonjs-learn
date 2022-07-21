/* eslint-disable space-before-function-paren */
const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const fse = require("fs-extra");

class RunAftercompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy assets", function () {
      fse.copySync("./src/scenes", "./app/scenes");
    });
  }
}

const config = {
  entry: "./src/index.tsx",
  output: {
    publicPath: "/",
    filename: "myBundle.[hash].js",
    path: path.resolve(__dirname, "app"),
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new RunAftercompile(),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.ts|\.js$|\.jsx$|\.tsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.svg|\.png|\.jpg|\.glb|\.gpx$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[hash].[ext]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

if (currentTask === "dev") {
  config.mode = "development";
  config.devtool = "eval";
  config.devServer = {
    port: 4002,
    static: { directory: path.resolve(__dirname, "app") },
    hot: true,
    liveReload: false,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  };
}

if (currentTask === "build") {
  config.mode = "production";
  config.module.rules[0].use[0] = MiniCssExtractPlugin.loader;
  config.plugins.push(
    new MiniCssExtractPlugin({ filename: "main.[hash].css" }),
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin()
  );
  config.output = {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  };
}

module.exports = config;
