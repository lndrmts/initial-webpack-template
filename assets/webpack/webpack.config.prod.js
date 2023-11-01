const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const autoprefixer = require('autoprefixer')

const PATHS = {
  src: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../dist'),
}
module.exports = {
  mode: 'production',
  entry: {
    site: `${PATHS.src}/index.js`,
  },
  output: {
    filename: 'scripts/[name].min.js',
    path: PATHS.dist,
  },

  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',

        options: {
          exposes: {
            globalName: 'jQuery',
            override: true,
          },
        },
      },
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts',
              publicPath: '../',
              useRelativePaths: true,
            },
          },
        ],
      },
      {
        test: /icons\/index\.js/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'webfonts-loader',
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'cache-loader',
          },
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
              publicPath: '../',
              useRelativePaths: true,
            },
          },
          {
            loader: 'image-webpack-loader',
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles/[name].min.css' }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          encodeOptions: {
            jpeg: {
              quality: 90,
            },
            webp: {},
            avif: {},
            png: {
              optimizationLevel: 7,
            },
            gif: {},
          },
          plugins: [
            'imagemin-gifsicle',
            'imagemin-mozjpeg',
            'imagemin-pngquant',
            'imagemin-svgo',
          ],
        },
      },
    }),
    new ImageMinWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png)/,
          options: {
            quality: 75,
          },
        },
      ],
      minFileSize: 1000,
      overrideExtension: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATHS.src}/images`,
          to: `${PATHS.dist}/images`,
        },
        {
          from: `${PATHS.src}/fonts`,
          to: `${PATHS.dist}/fonts`,
        },
      ],
    }),
    new WebpackManifestPlugin(),
  ],
}
