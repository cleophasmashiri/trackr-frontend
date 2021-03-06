module.exports = function (grunt) {
    'use strict';
    var config = {
        distFolder: 'dist',
        name: 'trackr'
    };

    grunt.initConfig({
        config: config,

        jshint: {
            dev: {
                files: [{
                    src: ['src/modules/**/*.js', 'Gruntfile.js', 'src/flatify/scripts/flatify-directives.js']
                }],
                options: {
                    jshintrc: '.jshintrc'
                }
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                files: [{
                    src: ['test/**/*.js', '!test/test-main.js']
                }]
            }
        },

        usemin: { /* The html file in which to do the actual replacement */
            html: ['<%= config.distFolder %>/index.html']
        },

        useminPrepare: { /* Read what to minimize from the dev html file */
            html: 'index.html',
            options: {
                dest: '<%= config.distFolder %>' /* the concatenated files should be placed in "dist" */
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.',
                        dest: '<%= config.distFolder %>',
                        src: [
                            'index.html',
                            'bootstrap.prod.js',
                            'src/modules/**/*.tpl.html',
                            'src/vendor/**',
							'src/flatify/**'
                        ]
                    }
                ]
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    mainConfigFile: 'bootstrap.js',
                    include: ['app', 'prodstarter'],
                    insertRequire: ['prodstarter'],
                    out: '<%= config.distFolder %>/trackr.js',
                    paths: {
                        'jQuery': 'empty:',
                        'twitter-bootstrap': 'empty:',
                        'angular': 'empty:',
                        'angular-l10n-de': 'empty:',
                        'angular-ui-router': 'empty:',
                        'restangular':'empty:',
                        'lodash': 'empty:',
                        'angular-translate': 'empty:',
                        'angular-translate-loader-url': 'empty:',
                        'angular-ui': 'empty:',
                        'moment': 'empty:',
                        'chartjs': 'empty:',
                        'randomColor': 'empty:',
                        'configuration': 'empty:'
                    }
                }
            }
        },

        /* Compress Javascript */
        uglify: {
            options: {
                mangle: true,
                compress: true,
                report: 'min'
            }
        },

        clean: ['<%= config.distFolder %>'],

        processhtml: {
            options: {
                commentMarker: 'process'
            },
            dist: {
                files: {
                    '<%= config.distFolder %>/index.html': '<%= config.distFolder %>/index.html'
                }
            }
        },

        karma: {
            dev: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['Chrome', 'Firefox']
            },
            test: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            teamcity: {
                configFile: 'karma.conf.js',
                singleRun: true,
                reporters: ['progress', 'teamcity', 'coverage', 'junit'],
                coverageReporter: {
                    type : 'lcovonly',
                    dir : 'reports',
                    subdir: 'coverage'
                },
                junitReporter: {
                    outputFile: 'reports/junit/TEST-karma.xml'
                }
            },
            cover: {
                configFile: 'karma.conf.js',
                singleRun: true,
                reporters: ['progress', 'coverage']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('dev', ['jshint:dev', 'karma:dev']);
    grunt.registerTask('test', ['jshint', 'karma:test']);
    grunt.registerTask('teamcityTest', ['jshint', 'karma:teamcity']);
    grunt.registerTask('dist', ['clean', 'useminPrepare', 'concat', 'copy', 'requirejs', 'uglify', 'cssmin', 'usemin', 'processhtml']);
};