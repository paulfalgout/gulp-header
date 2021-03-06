/* jshint node: true */
'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var extend = require('object-assign');

var headerPlugin = function(headerText, data) {
    headerText = headerText || '';

    var stream = through.obj(function(file, enc, cb) {

        var template = gutil.template(headerText, extend({file : file}, data));

        if (file.isBuffer()) {
            file.contents = Buffer.concat([
                new Buffer(template),
                file.contents
            ]);
        }

        if (file.isStream()) {
            var stream = through();
            stream.write(new Buffer(template));
            stream.on('error', this.emit.bind(this, 'error'));
            file.contents = file.contents.pipe(stream);
        }

        // make sure the file goes through the next gulp plugin
        this.push(file);
        // tell the stream engine that we are done with this file
        cb();
    });

    // returning the file stream
    return stream;
};

module.exports = headerPlugin;
