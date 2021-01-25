const gulp = require('gulp');
const requireDir = require('require-dir');

const {
    buildTypes: {
        development,
        production
    },
    directories: {
        tasksDirectory
    },
    environmentalVariables: {
        buildEnvironment,
        injectedEnvironment
    },
    tasks: {
        bundle,
        cleanDist,
        lintCSS,
        lintJS,
        serveInject,
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

gulp.task('dev-live', async () => {
    process.env[buildEnvironment] = development;
    process.env[injectedEnvironment] = true;

    return gulp.series(
        cleanDist,
        gulp.parallel(
            lintJS,
            lintCSS
        ),
        gulp.parallel(
            bundle,
            watch,
            serveInject
        )
    );
});

gulp.task('build-watch', async () => {
    process.env[buildEnvironment] = development;

    return gulp.series(
        cleanDist,
        gulp.parallel(
            lintJS,
            lintCSS
        ),
        gulp.parallel(
            bundle,
            watch
        )
    );
});

gulp.task('build-prod', async () => {
    process.env[buildEnvironment] = production;

    return gulp.series(
        cleanDist,
        gulp.parallel(
            lintJS,
            lintCSS
        ),
        gulp.parallel(
            bundle
        )
    );
});

gulp.task('lint', gulp.parallel(
    lintCSS,
    lintJS
));
