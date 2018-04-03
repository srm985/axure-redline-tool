/**
 * Axure Redline Tool - Project Scripts
 *
 * Author:      Sean McQuay
 * Web:         www.seanmcquay.com
 *
 * Modified:    6 February 2018
 */

'use strict';

const gulp = require('gulp'),
    del = require('del'),
    fs = require('fs'),
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
    rename = require('gulp-rename'),
    injectString = require('gulp-inject-string'),
    gulpSequence = require('gulp-sequence'),
    gulpif = require('gulp-if');

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

function copyDemo() {
    return gulp.src('src/demo/*')
        .pipe(gulp.dest('web/'))
}

/**
 * Clear up our web directory.
 */
gulp.task('clean', () => {
    del.sync(['web/*']);
});

/**
 * When in development mode,
 * copy our demo files into the
 * web directory.
 */
gulp.task('copy-demo', () => {
    return copyDemo();
});

/**HTML build tasks include linting,
 * minification, and source maps if enabled.
 */
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

/**
 * CSS build includes concatenation of SCSS source
 * files, linting SCSS, precompiling into CSS,
 * applying vendor prefixes, minification, and providing
 * source maps if enabled.
 */
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
        .pipe(browserSync.stream());
});

/**
 * JS build tasks include concatenation of JS source
 * files, ES6 linting, transcompiling from ES6 to ES5,
 * minification, and providing source maps if enabled.
 */
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

/**
 * Task handles parsing our HTML, CSS, and JS web
 * files and injecting them into our plugin template.
 */
gulp.task('compile-app', () => {
    const HTML = fs.readFileSync('web/temp/measure.htm', 'utf-8'),
        CSS = fs.readFileSync('web/temp/styles.css', 'utf-8');

    return gulp.src('web/temp/main.js')
        .pipe(injectString.replace('"Inject:HTML"', HTML))
        .pipe(injectString.replace('"Inject:CSS"', `<style>${CSS}</style>`))
        .pipe(rename('axure-redline-plugin.js'))
        .pipe(gulp.dest('web/'))
        .pipe(injectString.replace(/(.*)/, '<script>$1</script>'))
        .pipe(rename('plugin.txt'))
        .pipe(gulp.dest('web/'));
});

/**
 * Task handles injecting our app HTML into
 * our demo template when serving in demo mode.
 */
gulp.task('inject-app', () => {
    return injectApp();
});

/**
 * Task removes /temp directory when building
 * the app for production.
 */
gulp.task('remove-temp', () => {
    del.sync(['web/temp']);
});

/**
 * Task is used during build-watch to
 * watch for file changes and rebuild the
 * plugin export.
 */
gulp.task('watch', () => {
    gulp.watch('src/measure.htm', ['build-html']);
    gulp.watch('src/scss/**/*.scss', ['build-css']);
    gulp.watch('src/js/**/*.js', ['build-js']);
    gulp.watch('web/temp/*', ['compile-app']);
});

/**
 * Task handles serving our demo app
 * and watching relevant files.
 */
gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './web/',
            index: 'demo.htm'
        },
        reloadDelay: 50,
        reloadDebounce: 250
    });

    gulp.watch('src/measure.htm', ['build-html']);
    gulp.watch('src/scss/**/*.scss', ['build-css']);
    gulp.watch('src/js/**/*.js', ['build-js']);
    gulp.watch('web/temp/*', ['compile-app']).on('change', (e) => {
        copyDemo();
        setTimeout(() => {
            /* injectApp(); */
            browserSync.reload();
        }, 500);
    })
});

// Build and watch the app and serve in a demo wrapper.
gulp.task('develop', gulpSequence(['clean', 'build-html', 'build-css', 'build-js', 'copy-demo'], ['compile-app'], 'serve'));

// Build and watch the app - this updates the plugin code to be copied into Axshare.
gulp.task('build-watch', gulpSequence(['clean', 'build-html', 'build-css', 'build-js'], 'compile-app', 'watch'));

// Build the app for production.
gulp.task('build-prod', gulpSequence(['clean', 'build-html', 'build-css', 'build-js'], 'compile-app', 'remove-temp'));
