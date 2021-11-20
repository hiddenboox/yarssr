import path from 'path';
import fs from 'fs-extra';
import async from 'async';

export class WebpackDiskPlugin {
    constructor(opts) {
        this.opts = Object.create(opts || {});
        this.opts.files = this.opts.files || [];
        this.opts.output = this.opts.output || {};
        this.opts.output.path = this.opts.output.path || ".";
    }

  mapAssets = (assets) => {
    var basePath = this.opts.output.path;
    var files = this.opts.files;
    files = Array.isArray(files) ? files : [files];

    return Object.keys(assets)
      .map(function (asset) {
        return files
          .filter(function (file) {
            var assetMatch = file.asset;
            return typeof assetMatch === "string" ? assetMatch === asset : assetMatch.test(asset);
          })
          .map(function (file) {
            var output = file.output || {};

            var filePath = typeof output.path === "undefined" ? basePath : output.path;

            var fileName = output.filename || asset;
            if (typeof fileName === "function") {
              fileName = fileName(asset);
            }

            return { asset: asset, output: path.resolve(filePath, fileName) };
          });
      })
      .filter(function (pair) { return pair.length; })
      .reduce(function (memo, pair) {
        return memo.concat(pair);
      }, []);
      }

      normalModuleLoaderHook = (compilation) => {
        var assets = compilation.assets;
        const assetMap = this.mapAssets(compilation.assets);
          const uniqOutputs = assetMap
            .map(function (pair) { return pair.output; })
            .filter(function (output, idx, arr) { return arr.indexOf(output) === idx; });
            if (assetMap.length !== uniqOutputs.length) {
            return void callback(
                new Error("Found 2+ files outputting to same path: " + JSON.stringify(assetMap)));
            }
            async.each(assetMap, function (pair, cb) {
                async.series([
                  fs.ensureFile.bind(fs, pair.output),
                  fs.writeFile.bind(fs, pair.output, assets[pair.asset].source())
                ], cb);
              });
        };

  apply(compiler) {
    compiler.hooks.emit.tap('WebpackDiskPlugin', this.normalModuleLoaderHook);
  }
};
