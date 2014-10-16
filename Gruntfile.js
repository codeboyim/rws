'use strict';

var LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({
        port: LIVERELOAD_PORT
    }),
    mountFolder = function(connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

module.exports = function(grunt) {

    // load all grunt tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-open');

    grunt.initConfig({

        watch: {
            livereload: {
                files: [
                    '**/*.{html,htm,css,js}'
                ],
                options: {
                    livereload: LIVERELOAD_PORT
                }
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, './src')
                        ];
                    }
                }
            }
        },

        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },

        requirejs: {
            compile: {
                options: {
                    // mainConfigFile: "path/to/config.js",
                    // name: "path/to/almond", // assumes a production build using almond
                    appDir: 'src',
                    baseUrl: 'app',
                    dir: 'build',
                    modules: [{
                        name: '../scripts/main',
                        include: ['main']
                    }],
                    paths: {
                        'risk': 'components/risk',
                        'treatment': 'components/treatment',
                        'analysis': 'components/analysis',
                        'assessment': 'components/assessment',
                        'note': 'components/note',
                        'factor': 'components/factor',
                        'underscore': '../lib/underscore/underscore-min',
                        'backbone': '../lib/backbone/backbone',
                        'jquery': '../lib/jquery/dist/jquery.min',
                        'text': '../lib/requirejs-text/text',
                        'jquery-ui': '../lib/jquery-ui/ui'
                    },

                    packages: [{
                        name: 'modal',
                        location: 'components/modal'
                    }],
                    skipDirOptimize: true,
                    optimize: 'uglify2',
                    removeCombined: true,
                    findNestedDependencies: true
                }
            }
        }

    });

    grunt.registerTask('server', function() {
        grunt.task.run([
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('default', ['server']);
    grunt.registerTask('build', ['requirejs:compile']);
};
