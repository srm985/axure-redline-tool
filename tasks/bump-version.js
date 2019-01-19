const bump = require('gulp-bump');
const gulp = require('gulp');
const inquirer = require('inquirer');

const {
    directories: {
        rootDirectory
    },
    packageJSON,
    tasks: {
        bumpVersion
    }
} = require('../gulp.config.js')();

gulp.task(bumpVersion, () => {
    inquirer.prompt({
        choices: ['patch', 'minor', 'major'],
        message: 'Please select bump type.',
        name: 'bumpType',
        type: 'checkbox'
    }).then((selection) => {
        const {
            bumpType
        } = selection;

        gulp.src(packageJSON)
            .pipe(bump({ type: bumpType[0] }))
            .pipe(gulp.dest(rootDirectory));
    });
});
