'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var path = {
        src: 'src',
        dist: 'dist'
    };

    grunt.initConfig({
        path: path,
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options: {
                nospawn: true,
            },
            scripts: {
                files: ['<%= jshint.scripts %>'],
                tasks: ['jshint:scripts']
            },
            gruntfile: {
                files: ['<%= jshint.gruntfile %>'],
                tasks: ['jshint:gruntfile']
            }
        },
        clean: {
            dist: ['<%= path.dist %>']
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: [
                'Gruntfile.js'
            ],
            scripts: [
                '<%= path.src %>/**/*.js',
                '!<%= path.src %>/vendor/**/*.js',
            ],
            all: [
                'Gruntfile.js',
                '<%= path.src %>/**/*.js',
                '!<%= path.src %>/vendor/**/*.js'
            ]
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: ['pkg'],
                commit: true,
                commitMessage: 'chore(release): %VERSION%',
                commitFiles: ['package.json', 'CHANGELOG.md'],
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'version %VERSION%',
                push: false,
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },
        uglify: {
            options: {
                preserveComments: false,
                banner: '/**\n * <%= pkg.name %> - <%= pkg.version %>\n * <%= pkg.author %>\n */\n\n'
            },
            build: {
                options: {
                    compress: false
                },
                files: {
                    '<%= path.dist %>/bg.js': [
                        '<%= path.src %>/vendor/promise-0.1.1.js',
                        '<%= path.src %>/icons.js',
                        '<%= path.src %>/main.js'
                    ]
                }
            },
            dist: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    '<%= path.dist %>/bg.js': '<%= path.dist %>/bg.js'
                }
            }
        },
        copy: {
            manifest: {
                src: '<%= path.src %>/manifest.json',
                dest: '<%= path.dist %>/manifest.json',
                options: {
                    process: function (content, path) {
                        return grunt.template.process(content);
                    }
                }
            },
            icons: {
                files: [{
                    expand: true,
                    cwd: '<%= path.src %>',
                    dest: '<%= path.dist %>',
                    src: [
                        'icons/**/*.png'
                    ]
                }]
            }
        }
    });

    grunt.registerTask('build', [
        'clean',
        'uglify:build',
        'copy'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);

    grunt.registerTask('dist', [
        'jshint',
        'build',
        'uglify:dist',
        'bump-only:minor',
        'changelog',
        'bump-commit'
    ]);
};
