module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        jslint: {
            client: {
                src: [
                    'lib/runner.js',
                    'lib/listeners/**.js'
                ],
                directives: {
                    browser: true
                }
            }
        },
        uglify: {
            runner: {
                files: {
                    'lib/runner.min.js': ['lib/vendor/jquery-1.9.1.min.js',
                        'lib/runner.js',
                        'lib/listeners/report.js',
                        'lib/listeners/html.js',
                        'lib/listeners/htmlReport.js',
                        'lib/listeners/console.js',
                        'lib/vendor/cucumber.js']
                }
            }
        }
    });

    grunt.registerTask('bundle', ['jslint', 'uglify']);
    grunt.registerTask('default', 'bundle');
};
