module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            css: {
                files: ['src/scss/**/*'],
                tasks: ['sass', 'postcss']
            },
            src: {
                files: ['src/**/*'],
                tasks: ['clean', 'copy', 'sass', 'postcss', 'cssmin', 'uglify', 'file_append', 'copy-part-of-file', 'concat', 'minifyHtml']
            },
            options: {
                livereload: true,
            }
        },
        clean: {
            files: [
                'web/**/*'
            ]
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src/supporting', src: ['markup.htm'], dest: 'web/temp/' }
                ]
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'src/css/measure.css': 'src/scss/measure.scss',
                }
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({ browsers: ['last 100 versions'] })
                ]
            },
            dist: {
                expand: true,
                cwd: 'src/css',
                src: 'measure.css',
                dest: 'web/temp/'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'web/temp',
                    src: 'measure.css',
                    dest: 'web/temp/'
                }]
            }
        },
        uglify: {
            options: {
                compress: true,
                mangle: true
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: 'measure.js',
                    dest: 'web/temp/'
                }]
            }
        },
        'file_append': {
            default_options: {
                files: [{
                    append: '</style>',
                    prepend: '<style type="text/css">',
                    input: 'web/temp/measure.css',
                    output: 'web/temp/measure.css'
                }, {
                    append: '</script>',
                    prepend: '<script type="text/javascript">',
                    input: 'web/temp/measure.js',
                    output: 'web/temp/measure.js'
                }]
            }
        },
        'copy-part-of-file': {
            simple_replace_scripts: {
                options: {
                    sourceFileStartPattern: '<!-- COMPILATION CONTENT -->',
                    sourceFileEndPattern: '<!-- COMPILATION END -->',
                    destinationFileStartPattern: '<!-- MARKUP START -->',
                    destinationFileEndPattern: '<!-- MARKUP END -->'
                },
                files: {
                    'web/temp/markup.htm': ['src/measure.htm']
                }
            }
        },
        concat: {
            dist: {
                src: ['src/supporting/cdn-links.htm', 'web/temp/markup.htm', 'web/temp/measure.css', 'web/temp/measure.js'],
                dest: 'web/plugin.txt',
            },
        },
        minifyHtml: {
            options: {
                cdata: true
            },
            dist: {
                files: {
                    'web/plugin.txt': 'web/plugin.txt'
                }
            }
        }
    });

    grunt.registerTask('develop', ['watch']);
    grunt.registerTask('build', ['clean', 'copy', 'sass', 'postcss', 'cssmin', 'uglify', 'file_append', 'copy-part-of-file', 'concat', 'minifyHtml']);
    grunt.registerTask('server', ['connect']);
};