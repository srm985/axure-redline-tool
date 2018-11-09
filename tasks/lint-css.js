const gulp = require('gulp');
const gulpIf = require('gulp-if');
const sassLint = require('gulp-sass-lint');

const {
    buildTypes: {
        production
    },
    configFiles: {
        sassConfig
    },
    directories: {
        srcDirectory
    },
    environmentalVariables: {
        buildEnvironment
    },
    tasks: {
        lintCSS
    }
} = require('../gulp.config.js')();

gulp.task(lintCSS, () => {
    const shouldFailOnError = process.env[buildEnvironment] === production;

    return gulp.src(`${srcDirectory}/**/*.scss`)
        .pipe(sassLint({ configFile: sassConfig }))
        .pipe(sassLint.format())
        .pipe(gulpIf(shouldFailOnError, sassLint.failOnError()));
});
