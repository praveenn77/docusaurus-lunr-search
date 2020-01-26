/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

module.exports = function() {
  return {
    name: 'docusurus-lunr-search',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    configureWebpack() {
      // Ensure that algolia docsearch css is its own chunk
      return {
        optimization: {
          splitChunks: {
            cacheGroups: {
              algolia: {
                name: 'algolia',
                test: /algolia\.css$/,
                chunks: `all`,
                enforce: true,
                // Set priority higher than docusaurus single-css extraction
                priority: 60,
              },
            },
          },
        },
      };
    },
  };
};
