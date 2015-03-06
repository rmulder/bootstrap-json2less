/*
 * grunt-bootstrap-json2less
 * https://github.com/rmulder/bootstrap-json2less
 *
 * Copyright (c) 2015 Robert Mulder
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');
var less = require('less');

module.exports = function (grunt) {

  grunt.registerMultiTask('bootstrap_less2json', 'Convert a Bootstrap config.json file to variables.less', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var shell = require('shelljs');
    var lessVars = {};
    var options = this.options({
      dist: null, //distribution folder. Leave blank for same folder
      varPrefix: '',// set to '@' if not included in config.json
      ignoreWithPrefix: '' // any valid string e.g. "_" would ignore @_base
    });

    function removeExtension(file) {
      var result = file.split(".");
      return result[0];
    }

    this.files.forEach(function (file) {
      // parse, eval and save less variables
      file.src.forEach(function (src) {
        var key, $search, content, outputContent, jsonContent, outputFile = file.dest;
        outputContent = grunt.file.read(outputFile);
        jsonContent = JSON.parse(outputContent);
        console.log('jsonContent:', jsonContent);
/*
 if (content.vars) {
 for (key in content.vars) {
 $search = options.varPrefix + removeExtension(key.replace(/\\/g, "_"));
 var regex1 = new RegExp('(\\' + $search + ':)(\\s+)(.+);(.+)?\\n');
 shell.sed('-i', regex1, "$1$2" + content.vars[key] + ';' + "$4\n", file.dest);
 }
 }

 */
        content = grunt.file.read(src);
        var parser = new less.Parser({
          syncImport: true,
          paths: path.dirname(path.resolve(src)),
          filename: path.basename(src)
        });

        parser.parse(content, function (err, tree) {
          var env = new less.tree.evalEnv();
          var ruleset = tree.eval(env); // jshint ignore:line
          var prefix = options.ignoreWithPrefix || null;

          ruleset.rules.forEach(function (rule) {
            if (rule.variable) {
              var name = rule.name.substr(1); // remove "@"

              if (!prefix || name.substr(0, prefix.length) !== prefix) {
                var value = rule.value.value[0]; // can be less.tree.Color, less.tree.Expression, etc.
                lessVars[name] = value.toCSS();
              }
            }
          });
        });
      });

      // process and write the data
      var output = JSON.stringify(lessVars, null, 2);
      var outputFile = file.dest;

      grunt.file.write(outputFile, output);
      grunt.log.ok('%s succesfully created!', outputFile);
      if (options.dist) {
        shell.cp('-f', file.dest, options.dist);
        grunt.log.ok('successfully copied: %s to: %s', file.dest, options.dist);
      }
    });

  });

};
