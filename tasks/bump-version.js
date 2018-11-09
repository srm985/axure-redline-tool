const bump = require('gulp-bump');
const gulp = require('gulp');
const prompt = require('gulp-prompt');

const {
    directories: {
        rootDirectory
    },
    packageJSON,
    tasks: {
        bumpVersion
    }
} = require('../gulp.config.js')();

gulp.task(bumpVersion, () => gulp.src(packageJSON)
    .pipe(prompt.prompt({
        choices: ['patch', 'minor', 'major'],
        message: 'Please select bump type.',
        name: 'bumpType',
        type: 'checkbox'
    }, (selection) => {
        const {
            bumpType
        } = selection;

        gulp.src(packageJSON)
            .pipe(bump({ type: bumpType[0] }))
            .pipe(gulp.dest(rootDirectory));
    })));
