const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
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

gulp.task('sandbox', () => {
    process.env[buildEnvironment] = development;

    return gulpSequence(
        [
            cleanDist
        ],
        [
            lintJS,
            lintCSS
        ],
        [
            serveSandbox,
            watch
        ]
    )();
});

gulp.task('dev-live', () => {
    process.env[buildEnvironment] = development;
    process.env[injectedEnvironment] = true;

    return gulpSequence(
        [
            cleanDist
        ],
        [
            lintJS,
            lintCSS
        ],
        [
            bundle,
            watch,
            serveInject
        ]
    )();
});

gulp.task('build-watch', () => {
    process.env[buildEnvironment] = development;

    return gulpSequence(
        [
            cleanDist
        ],
        [
            lintJS,
            lintCSS
        ],
        [
            bundle,
            watch
        ]
    )();
});

gulp.task('build-prod', () => {
    process.env[buildEnvironment] = production;

    return gulpSequence(
        [
            cleanDist
        ],
        [
            lintJS,
            lintCSS
        ],
        [
            bundle
        ]
    )();
});

gulp.task('lint', [lintCSS, lintJS]);
