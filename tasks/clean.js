const del = require('del');
const gulp = require('gulp');

const {
    directories: {
        distDirectory,
        legacyWebDirectory
    },
    tasks: {
        cleanDist
    }
} = require('../gulp.config.js')();

gulp.task(cleanDist, () => {
    del.sync([`${distDirectory}/**`, `!${distDirectory}`]);
    del.sync([`${legacyWebDirectory}/**`, `!${legacyWebDirectory}`]);
});
