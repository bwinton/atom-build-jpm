/* globals process:false */

'use strict';

var fs = require('fs');
var path = require('path');

exports.provideBuilder = function () {
  return class JpmBuilder {

    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'JPM';
    }

    isEligible() {
      if (!fs.existsSync(path.join(this.cwd, 'package.json'))) {
        return false;
      }

      var realPackage = fs.realpathSync(path.join(this.cwd, 'package.json'));
      delete require.cache[realPackage];
      var pkg = require(realPackage);

      if (!pkg.engines || !pkg.engines.firefox) {
        return false;
      }

      return true;
    }

    settings() {
      var executableExtension = /^win/.test(process.platform) ? '.cmd' : '';

      var config = [{
        name: 'jpm: run',
        exec: 'jpm' + executableExtension,
        args: [ 'run' ],
        sh: false
      }, {
        name: 'jpm: xpi',
        exec: 'jpm' + executableExtension,
        args: [ 'xpi' ],
        sh: false
      }];

      return config;
    }
  }
};
