/*
 * grunt-cropthumb
 * https://github.com/jbakse/grunt-cropthumb
 *
 * Copyright (c) 2013 Justin Bakse
 * Licensed under the MIT license.
 *
 * this code references https://github.com/excellenteasy/grunt-image-resize/blob/master/tasks/image_resize.js
 *
 */

'use strict';

var fs = require('fs');
var gm = require('gm');
var path = require('path');


module.exports = function(grunt) {
  grunt.registerMultiTask('cropthumb', 'Crops and scales image to create thumbnail.', function() {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      width: 200,
      height: 200,
      quality: 100,
      overwrite: false,
      changeName: true
    });

    // Iterate over all specified file groups.
    grunt.util.async.forEachSeries(this.files, function(f, callback) {

      var dest_dir = path.dirname(f.dest),
        dest_ext = path.extname(f.dest),
        dest_name = path.basename(f.dest, dest_ext),
        source_file = f.src[0],
        dest_file = dest_dir + "/" + dest_name + dest_ext;

      if (options.changeName){
        dest_file = dest_dir + "/" + dest_name + "." + options.width + dest_ext;
      }

      if (!grunt.file.isDir(dest_dir)) {
        grunt.file.mkdir(dest_dir);
      }

      if (f.src.length !== 1) {
        return grunt.fail.fatal("Can not create a single thumb for more than one image.\n" +
          "You need to use a different 'files' format in your Gruntfile.");
      }

      if (options.overwrite === false && grunt.file.isFile(dest_file)) {
        return grunt.log.writeln("Skipping " + source_file + " because destination already exists.\n" +
          "Set options 'overwrite' to true to enable overwriting of files.");
      }

      var image = gm(source_file);  
        image
          .quality(options.quality)
          .gravity('Center')
          .resize(options.width, options.height, '^')
          .crop(options.width, options.height)
          .write(dest_file, function(err) {
            if (err) {
              grunt.log.error("error creating cropthumb");
              callback(err);
            } else {
              grunt.log.writeln('Cropthumb "' + dest_file + '" created.');
              callback();
            }
          });


    }, function(err) {
      done(!err);
    });
  });
}