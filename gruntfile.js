module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-newer');

    grunt.initConfig({
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
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({ browsers: ['last 15 versions'] })
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
                dest: 'web/compilation.htm',
            },
        },
        minifyHtml: {
            options: {
                cdata: true
            },
            dist: {
                files: {
                    'web/compilation.min.htm': 'web/compilation.htm'
                }
            }
        }
    });

    grunt.registerTask('default', ['clean', 'copy', 'postcss', 'cssmin', 'uglify', 'file_append', 'copy-part-of-file', 'concat', 'minifyHtml']);
};
