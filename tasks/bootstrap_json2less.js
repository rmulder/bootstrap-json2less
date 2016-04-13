/*
 * grunt-bootstrap-json2less
 * https://github.com/rmulder/bootstrap-json2less
 *
 * Copyright (c) 2015 Robert Mulder
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('bootstrap_json2less', 'Convert a Bootstrap config.json file to variables.less', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var shell = require('shelljs');
    var options = this.options({
      dist: null,
      bs_dir: null, //bootstrap directory. Leave blank for same folder
      bs_tasks: ['dist'],
      varPrefix: '',// set to '@' if not included in config.json
      banner: '// DO NOT EDIT! CREATED/EDITED AUTOMATICALLY with grunt-bootstrap-json2less'
    });

    function removeExtension(file) {
      var result = file.split(".");
      return result[0];
    }

    this.files.forEach(function (file) {
      // parse, eval and save less variables
      file.src.forEach(function (src) {
        var key, $search, content, inputContent, lessContent, outputFile = file.dest;
        inputContent = grunt.file.read(src);
        content = JSON.parse(inputContent);

        if (content.vars) {
          for (key in content.vars) {
            $search = options.varPrefix + removeExtension(key.replace(/\\/g, "_"));
            var regex1 = new RegExp('(\\' + $search + ':)(\\s+)(.+);(.+)?\\n');
            shell.sed('-i', regex1, "$1$2" + content.vars[key] + ';' + "$4\n", file.dest);
          }
        }

        if (options.banner) {
          lessContent = grunt.file.read(outputFile);
          if (lessContent.indexOf(options.banner) === -1) {
            lessContent = [options.banner, lessContent].join('\n');
            grunt.file.write(outputFile, lessContent);
          }
        }

        grunt.log.ok('%s successfully updated!', outputFile);
        if (options.dist) {
          shell.cp('-f', file.dest, options.dist);
          grunt.log.ok('successfully copied: %s to: %s', file.dest, options.dist);
        }
        if (options.bs_dir) {
          var dir = shell.pwd();
          shell.cd(options.bs_dir);
          //build new bootstrap files
          if (shell.exec('grunt ' + options.bs_tasks.join(' ')).code !== 0) {
            shell.echo('Error: Bootstrap build failed');
            shell.exit(1);
          }
          shell.cd(dir);
          grunt.log.ok('successfully built new bootstrap files in directory: %s', options.bs_dir);
        }
      });
    });
  });

};
