const gulp = require('gulp');
const rename = require('gulp-rename');

const {
    bundleName,
    directories: {
        distDirectory,
        legacyWebDirectory
    },
    legacyBundleName,
    tasks: {
        legacySupport
    }
} = require('../gulp.config.js')();

gulp.task(legacySupport, () => gulp.src(`${distDirectory}/${bundleName}.js`)
    .pipe(rename(`${legacyBundleName}.js`))
    .pipe(gulp.dest(`${legacyWebDirectory}`)));
