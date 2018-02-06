'use strict';

const gulp = require('gulp'),
    del = require('del'),
    merge = require('merge-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    htmllint = require('gulp-html-lint'),
    htmlmin = require('gulp-htmlmin'),
    sassLint = require('gulp-sass-lint'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    eslint = require('gulp-eslint'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create(),
    htmlInjector = require("bs-html-injector"),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject'),
    gulpSequence = require('gulp-sequence'),
    gulpif = require('gulp-if');

let env;

const arg = (argList => {
    let arg = {},
        a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {
        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');
        if (opt === thisOpt) {
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;
        } else {
            curOpt = opt;
            arg[curOpt] = true;
        }
    }
    return arg;
})(process.argv);


gulp.task('clean', () => {
    del.sync(['web/*']);
});

gulp.task('build-html', () => {
    return gulp.src('src/measure.htm')
        .pipe(gulpif(arg.sourcemap, sourcemaps.init()))
        .pipe(htmllint({
            rules: {
                'attr-no-dup': true,
                'id-no-dup': true,
                'img-req-alt': true,
                'attr-name-style': 'dash',
                'doctype-html5': true,
                'line-end-style': false,
                'tag-bans': ['align', 'background', 'bgcolor', 'border', 'frameborder', 'longdesc', 'marginwidth', 'marginheight', 'scrolling', 'style', 'width'],
                'id-class-style': 'dash',
                'img-req-src': false,
                'input-radio-req-name': true,
                'input-req-label': true,
                'label-req-for': true,
                'spec-char-escape': true,
                'tag-close': true,
                'tag-name-lowercase': true,
                'tag-name-match': true,
                'title-no-dup': true
            }
        }))
        .pipe(htmllint.format())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulpif(arg.sourcemap, sourcemaps.write()))
        .pipe(gulp.dest('web/temp'));
});

gulp.task('build-css', () => {
    return gulp.src('src/scss/**/*.scss')
        .pipe(gulpif(arg.sourcemap, sourcemaps.init()))
        .pipe(sassLint())
        .pipe(concat('styles.scss'))
        .pipe(sassLint.format())
        .pipe(sass())
        .pipe(autoprefixer('last 10 versions'))
        .pipe(cssnano())
        .pipe(gulpif(arg.sourcemap, sourcemaps.write()))
        .pipe(gulp.dest('web/temp'))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('build-js', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(gulpif(arg.sourcemap, sourcemaps.init()))
        .pipe(concat('main.js'))
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(uglify())
        .pipe(gulpif(arg.sourcemap, sourcemaps.write()))
        .pipe(gulp.dest('web/temp'));
});

gulp.task('compile-app', () => {
    return gulp.src(['src/supporting/cdn-links.htm', 'web/temp/*'])
        .pipe(concat('plugin.txt'))
        .pipe(gulp.dest('web'));
});

gulp.task('serve', () => {
    browserSync.use(htmlInjector, {
        files: 'web/*.htm'
    });
    /*browserSync.init({
        server: {
            baseDir: './web/',
            index: 'index.htm'
        },
        reloadDelay: 50,
        reloadDebounce: 250
    });*/

    gulp.watch('src/*.htm', ['build-html']);
    /*Uncomment if not using HTML injection.
    gulp.watch('src/*.htm', ['build-html']).on('change', (e) => {
        browserSync.reload();
    });*/
    gulp.watch('src/scss/**/*.scss', ['build-css']);
    gulp.watch('src/js/**/*.js', ['build-js']).on('change', (e) => {
        browserSync.reload();
    });
});

gulp.task('develop', ['clean', 'build-html', 'build-css', 'build-js', 'serve']);
gulp.task('build', gulpSequence(['clean', 'build-html', 'build-css', 'build-js'], 'compile-app'));
