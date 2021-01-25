const gulp = require('gulp');

const {
    directories: {
        srcDirectory
    },
    tasks: {
        lintCSS,
        lintJS,
        watch
    }
} = require('../gulp.config.js')();

gulp.task(watch, async () => {
    gulp.watch(`${srcDirectory}/**/*.js`, gulp.series(lintJS));
    gulp.watch(`${srcDirectory}/**/*.scss`, gulp.series(lintCSS));
});
