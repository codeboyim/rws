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
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-contrib-clean');

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
                    appDir: 'src',
                    dir: 'build',
                    mainConfigFile: "src/scripts/main.js",
                    baseUrl: 'app',
                    modules: [{
                        name: '../scripts/main',
                        include: ['../lib/almond/almond'],
                    }],
                    skipModuleInsertion: false,
                    optimize: 'none',
                    removeCombined: false,
                    preserveLicenseComments: false,
                    findNestedDependencies: true,
                    keepBuildDir:true
                }
            }
        },

        htmlbuild: {
            build: {
                src: 'src/index.html',
                dest: 'build/',
                options: {
                    beautify: true,
                    scripts: {
                        main: 'build/scripts/main.js'
                    }
                }
            }
        },

        clean: {
            options: {
                force: true
            },
            build: {
                expand: true,
                cwd: 'build',
                src: ['app','lib/**/*', 'lib', 'styles/**/*', '!styles/main.css']
            }
        },

        buildcontrol: {
            options: {
                dir: 'build',
                commit: true,
                push: true,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            pages: {
                options: {
                    remote: 'git@github.com:example_user/example_webapp.git',
                    branch: 'gh-pages'
                }
            },
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
    grunt.registerTask('build', ['requirejs', 'htmlbuild', 'clean']);
    grunt.registerTask('deploy', ['buildcontrol']);
};
