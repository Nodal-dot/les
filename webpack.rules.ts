import type { ModuleOptions } from 'webpack';

export const rules: Required<ModuleOptions>['rules'] = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.s[ac]ss$/i,
    use: [
      "style-loader",
      {
        loader: 'css-loader',
        options: {
            modules: {
                mode: 'local',
                auto: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                namedExport: true,
            },
            importLoaders: 2,
            sourceMap: true
        }
    },
      "sass-loader",
    ],
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
];
