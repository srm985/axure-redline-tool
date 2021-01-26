const gulp = require('gulp');
const requireDir = require('require-dir');

const {
    buildTypes: {
        development
    },
    directories: {
        tasksDirectory
    },
    environmentalVariables: {
        buildEnvironment
    },
    tasks: {
        cleanDist,
        lintCSS,
        lintJS,
        serveSandbox,
        watch
    }
} = require('./gulp.config.js')();

requireDir(tasksDirectory);

gulp.task('sandbox', async () => {
    process.env[buildEnvironment] = development;

    return gulp.series(
        cleanDist,
        gulp.parallel(
            lintJS,
            lintCSS
        ),
        gulp.parallel(
            serveSandbox,
            watch
        )
    );
});
