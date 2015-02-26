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
    var options = this.options({
      banner: '// DO NOT EDIT! GENERATED AUTOMATICALLY with grunt-bootstrap-json2less'
    });

    function removeExtension(file) {
      var result = file.split(".");
      return result = result[0];
    }

    this.files.forEach(function (file) {
      // parse, eval and save less variables
      file.src.forEach(function (src) {
        var content = grunt.file.read(src);
        var lessContent = "";

        //console.log('===== this is the output of var content: ', content);
        if (content.vars) {
          for (var key in content.vars) {
            lessContent += "@" + removeExtension(key.replace(/\\/g, "_"))+ ': "'+key+'";\n';
          }
        }


        var outputFile = file.dest;
        if (options.banner) {
          lessContent = [options.banner, lessContent].join('\n');
        }
        grunt.file.write(outputFile, lessContent);
        grunt.log.ok('%s succesfully created!', outputFile);
      });
    });
  });

};
