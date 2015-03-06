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
      // parse, eval and save less variables to config.json settings file
      var outputFile = file.dest, outputContent, jsonContent;
      outputContent = grunt.file.read(outputFile);
      //console.log('outputContent:', outputContent);
      jsonContent = JSON.parse(outputContent);
      file.src.forEach(function (src) {
        var key, value, matches, index, line, content;
        content = grunt.file.read(src).split('\n');
        //var regex1 = new RegExp(/^(\\@(.+):)(\\s+)(.+);(.+)?\\n/gi);
        //var regex1 = new RegExp('(\\@(.+):)(\\s+)(.+);(.+)?\\n');
        var regex1 = new RegExp('^(\\@.+:)(\\s+)(.+);(.+)?\\n');
        console.log('regex1:', regex1);

        var re = /^(\@.+):(\s+)(.+);(.+)?/ig;
        for (index in content) {
          line = content[index];
          //console.log('line:', line);
          //$search = options.varPrefix + removeExtension(key.replace(/\\/g, "_"));

          //var matches = line.search(/^(\\@.+:)(\\s+)(.+);(.+)?\\n/gi);
          //console.log('search: ', line.search(regex1));
          //console.log('matches:', matches);
          if ((matches = re.exec(line)) != null) {
            key = matches[1] || null;
            value = matches[3] || null;
            if (key && value) {
              console.log('key:', key, 'value:', value, 'jsonContent.vars[key]:', jsonContent.vars[key]);
              jsonContent.vars[""+key] = value;
            }
          }
        }
        //if (jsonContent.vars && content) {
/*
          for (key in jsonContent.vars) {
            $search = options.varPrefix + removeExtension(key.replace(/\\/g, "_"));
            var regex1 = new RegExp('(\\' + $search + ':)(\\s+)(.+);(.+)?\\n');
            console.log('$search:', $search, 'regex1:', regex1);
            //shell.sed('-i', regex1, "$1$2" + jsonContent.vars[key] + ';' + "$4\n", file.dest);
          }
          */
        //}

      });
      //console.log('updated jsonContent:', jsonContent.vars);
      grunt.file.write(outputFile, JSON.stringify(jsonContent, null, 2));
      grunt.log.ok('%s succesfully created!', outputFile);
      if (options.dist) {
        shell.cp('-f', file.dest, options.dist);
        grunt.log.ok('successfully copied: %s to: %s', file.dest, options.dist);
      }
    });

  });

};
