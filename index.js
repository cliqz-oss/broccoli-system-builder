var Output = require('systemjs-builder/lib/output'),
  Writer = require('broccoli-writer'),
  RSVP = require('rsvp'),
  path = require('path'),
  fs = require('fs');
  paths = {};

var writeOutputs = Output.writeOutputs;

Output.writeOutputs = function( outputs, baseURL, outputOpts ) {
  baseURL = baseURL.replace(paths.sourceDir, paths.destDir);

  if (outputOpts.outFile) {
    outputOpts.outFile = path.join(paths.destDir, outputOpts.outFile);
  }

  return writeOutputs.apply(this, arguments);
};

var Builder = require('systemjs-builder');

function SystemBuilder ( inputNodes, baseURL, configPath, fn ) {
  if (!(this instanceof SystemBuilder)) {
    return new SystemBuilder(inputNodes, baseURL, configPath, fn);
  }

  this.buildCount = 0;
  this.builder = new Builder();
  this.inputNodes = inputNodes;
  this.baseURL = baseURL;
  this.configPath = configPath;
  this.fn = fn;
};

SystemBuilder.prototype = Object.create(Writer.prototype);
SystemBuilder.prototype.constructor = SystemBuilder;

SystemBuilder.prototype.write = function( readTree, destDir ) {
  return readTree(this.inputNodes).then(function( sourceDir ) {
    var configPath = path.join(sourceDir, this.configPath),
      baseURL = path.join(sourceDir, this.baseURL),
      builder = this.builder,
      fn = this.fn;

    paths.sourceDir = sourceDir;
    paths.destDir = destDir;


    if (this.buildCount++ === 0) {
      builder.config({
        baseURL: baseURL
      }, true, false);

      builder.loadConfigSync(configPath, true, true);
    } else {
      builder.invalidate('*');
    }

    return new RSVP.Promise(function( resolve ) {
      resolve();
    }).then(function() {
      return fn(builder, sourceDir, destDir);
    });
  }.bind(this));
};

module.exports = SystemBuilder;