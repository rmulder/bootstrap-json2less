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

  grunt.registerMultiTask('bootstrap_less2json', 'Convert a Bootstrap variables.less file to config.json', function() {
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
      // parse, eval and save less variables to config.json settings file
      var outputFile = file.dest, outputContent, jsonContent;
      outputContent = grunt.file.read(outputFile);
      jsonContent = JSON.parse(outputContent);
      file.src.forEach(function (src) {
        var key, value, matches, index, line, content;
        content = grunt.file.read(src).split('\n');
        var regex1 = new RegExp('^(\\@.+:)(\\s+)(.+);(.+)?\\n');

        var re = /^(\@.+):(\s+)(.+);(.+)?/ig;
        for (index in content) {
          line = content[index];
          if ((matches = re.exec(line)) != null) {
            key = matches[1] || null;
            value = matches[3] || null;
            if (key && value) {
              jsonContent.vars[""+key] = value;
            }
          }
        }
      });

      grunt.file.write(outputFile, JSON.stringify(jsonContent, null, 2));
      grunt.log.ok('%s succesfully created!', outputFile);
      if (options.dist) {
        shell.cp('-f', file.dest, options.dist);
        grunt.log.ok('successfully copied: %s to: %s', file.dest, options.dist);
      }
    });
  });
};
