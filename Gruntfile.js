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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-build-control');
    grunt.loadNpmTasks('grunt-rev');


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
                    keepBuildDir: true
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
                        main: 'build/scripts/*.js'
                    },
                    styles: {
                        main: 'build/styles/*.css'
                    }
                }
            }
        },

        clean: {
            options: {
                force: true
            },
            prebuild: {
                src: ['build/styles/**/*', 'build/scripts/**/*']
            },
            postbuild: {
                expand: true,
                cwd: 'build',
                src: ['app',
                    'lib/!(fontawesome|jquery-ui)',
                    'lib/fontawesome/!(fonts)',
                    'lib/fontawesome/.*',
                    'lib/jquery-ui/!(themes)',
                    'lib/jquery-ui/themes/!(flick)',
                    'lib/jquery-ui/.*',
                    'styles/components', 'gitignore'
                ]
            }
        },

        buildcontrol: {
            options: {
                dir: 'build',
                commit: true,
                push: false,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            pages: {
                options: {
                    remote: 'git@github.com:codeboyim/rws.git',
                    branch: 'gh-pages'
                }
            },
        },

        copy: {
            build: {
                expand: true,
                src: 'src/gitignore',
                dest: 'build/',
                rename: function(desc, src) {
                    return 'build/.gitignore'
                }
            }
        },

        rev: {
            src: ['build/styles/*.css', 'build/scripts/*.js']
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
    grunt.registerTask('build', ['clean:prebuild', 'requirejs', 'rev', 'htmlbuild', 'clean:postbuild', 'copy']);
    grunt.registerTask('deploy', ['buildcontrol:pages']);
};
