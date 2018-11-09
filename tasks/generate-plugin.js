const gulp = require('gulp');
const inject = require('gulp-inject-string');
const rename = require('gulp-rename');

const {
    directories: {
        distDirectory
    },
    bundleName,
    tasks: {
        generatePlugin
    }
} = require('../gulp.config.js')();

gulp.task(generatePlugin, () => gulp.src(`${distDirectory}/${bundleName}.js`)
    .pipe(inject.wrap('<script>', '</script>'))
    .pipe(rename(`${bundleName}.txt`))
    .pipe(gulp.dest(`${distDirectory}`)));
