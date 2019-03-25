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

gulp.task(watch, () => {
    gulp.watch(`${srcDirectory}/**/*.js`, [lintJS]);
    gulp.watch(`${srcDirectory}/**/*.scss`, [lintCSS]);
});
