const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
const glob = require("glob");
const path = require("path");

exports.cssLoaders = options => {
  options = options || {};

  const cssLoader = {
    loader: require.resolve("css-loader"),
    options: {
      importLoaders: 1,
      minimize: process.env.NODE_ENV === "production" ? true : false,
      sourceMap:
        process.env.NODE_ENV === "production" ? options.sourceMap : true
    }
  };

  const postcssLoader = {
    loader: require.resolve("postcss-loader"),
    options: {
      ident: "postcss",
      plugins: () => [
        require("postcss-flexbugs-fixes"),
        autoprefixer({
          browsers: [
            ">1%",
            "last 4 versions",
            "Firefox ESR",
            "not ie < 9" // React doesn't support IE8 anyway
          ],
          flexbox: "no-2009"
        })
      ],
      sourceMap:
        process.env.NODE_ENV === "production" ? options.sourceMap : true
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = [cssLoader, postcssLoader];

    if (loader) {
      loaders.push({
        loader: require.resolve(loader + "-loader"),
        options: Object.assign({}, loaderOptions, {
          sourceMap:
            process.env.NODE_ENV === "production" ? options.sourceMap : true
        })
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        allChunks: true,
        fallback: "style-loader"
      });
    } else {
      return ["style-loader"].concat(loaders);
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    // less: generateLoaders('less'),
    scss: generateLoaders("sass")
  };
};

exports.styleLoaders = function(options) {
  const output = [];
  const loaders = exports.cssLoaders(options);

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp("\\." + extension + "$"),
      use: loader
    });
  }

  return output;
};

//按文件名来获取入口文件（即需要生成的模板文件数量）
exports.getEntry = function (globPath) {
  var files = glob.sync(globPath);
  var entries = {},
    entry,
    dirname,
    basename,
    pathname,
    extname;

  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.join(dirname, basename);
    entries[basename] = basename;
  }
  return entries;
}
