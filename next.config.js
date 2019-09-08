// This file is not going through babel transformation.
// So, we write it in vanilla JS.
// (But you could use ES2015 features supported by your Node.js version)
require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  webpack: (config, options) => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      new Dotenv({
        path: path.join(__dirname, '.env.build'),
        systemvars: true,
      }),
    ];

    // https://github.com/zeit/next.js/issues/6073#issuecomment-467589586
    const { isServer } = options;

    if (isServer) {
      config.node = Object.assign({}, config.node, {
        __dirname: false,
        __filename: false,
      });

      config.module.rules.unshift({
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: '@zeit/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'assets',
            existingAssetNames: [],
            wrapperCompatibility: true,
            escapeNonAnalyzableRequires: true,
          },
        },
      });
    }

    return config;
  },
};
