//var UglifyJS = require("uglify-js");
var compressor = require('node-minify');

var files = ['lib/vendor/jquery-1.9.1.min.js',
    'lib/runner.js',
    'lib/listeners/report.js',
    'lib/listeners/html.js',
    'lib/listeners/htmlReport.js',
    'lib/listeners/console.js',
    'lib/vendor/cucumber.js'];


// Using UglifyJS for JS
new compressor.minify({
    type: 'uglifyjs',
    fileIn: files,
    fileOut: 'lib/runner.min.js',
    callback: function(err, min){
        console.log(err);
//        console.log(min);
    }
});

//var result = UglifyJS.minify(files, {
//    warnings : true,
//    output : 'lib/runner.min.js'
//});

//console.log(result);
