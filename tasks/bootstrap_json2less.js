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
      dist: null, //distribution folder. Leave blank for same folder
      varPrefix: '',// set to '@' if not included in config.json
      banner: '// DO NOT EDIT! GENERATED AUTOMATICALLY with grunt-bootstrap-json2less'
    });

    function removeExtension(file) {
      var result = file.split(".");
      return result = result[0];
    }

    this.files.forEach(function (file) {
      // parse, eval and save less variables
      file.src.forEach(function (src) {
        var key, search, replace, content, inputContent, lessContent, outputFile = file.dest;
        //lessContent = grunt.file.read(outputFile);
        //console.log('lessContent:', lessContent);
        inputContent = grunt.file.read(src);
        content = JSON.parse(inputContent);

        //console.log('===== this is the output of var content: ', content);
        if (content.vars) {
          for (key in content.vars) {
            //lessContent += options.varPrefix + removeExtension(key.replace(/\\/g, "_"))+ ': "'+key+'";\n';
            search = options.varPrefix + removeExtension(key.replace(/\\/g, "_")) + ':';
            replace = search + ' ' + content.vars[key]+';\n';
            //lessContent += options.varPrefix + removeExtension(key.replace(/\\/g, "_"))+ ': '+content.vars[key]+';\n';
            //console.log('key:', key, 'value:', content.vars[key]);

            //^(\@brand-primary:)(\s+.+;)(.+)
            shell.sed('-i', '^(\\'+key+':)(\\s+.+;)(.+)', '\\1'+content.vars[key]+'\\3', file.dest);
/*
            var re1 = /^(\@brand-primary:)(\s+.+;)/ig;
            var re2 = /^(\@brand-primary:)(\s+.+;)/ig;
            //    return new RegExp('^' + matcher + '$');
            //         regex = new RegExp('^' + regex + '$');
//      regex = new RegExp('\\b' +  '(' + value.split(' ').join('|') + ')', 'i');
//  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
//    var source = '(?:' + _.keys(map).join('|') + ')';


            var expression1 = '^(\\', expression2 = ':)(\\s+.+;)';
            //var regex = new RegExp(expression1 + key + expression2, 'gi');
            var regex = new RegExp('^(\\' + key + ':)(\\s+.+;)','gi');

            //var matches = lessContent.match(/'^\@('+key+':)(\s+.+;)'/gi);
            var matches = lessContent.match(regex);
            console.log('regex:', regex, 'matches:', matches);
            if (matches !== null) {
              console.log('matches:', matches);
            }
*/
            //lessContent.replace(/'^\@('+key+':)(\s+.+;)'/ig, '');
          }
        }

        /*if (options.banner) {
          lessContent = grunt.file.read(outputFile);
          lessContent = [options.banner, lessContent].join('\n');
          grunt.file.write(outputFile, lessContent);
        } */
        grunt.log.ok('%s succesfully updated!', outputFile);
        if (options.dist) {
          shell.cp('-f', file.dest, options.dist);
          grunt.log.ok('succesfully copied: %s to: %s', file.dest, options.dist);
        }
      });
    });
  });

};
