const browserSync = require('browser-sync');
const gulp = require('gulp');
const prompt = require('gulp-prompt');

const {
    browserSyncConfig,
    packageJSON,
    tasks: {
        serveInject
    }
} = require('../gulp.config.js')();

const rpVersionChoices = {
    rp8: 'Serve RP8',
    rp9: 'Serve RP9'
};

gulp.task(serveInject, () => {
    const {
        rp8,
        rp9
    } = rpVersionChoices;

    const {
        proxyRP8,
        proxyRP9
    } = browserSyncConfig;

    return gulp.src(packageJSON)
        .pipe(prompt.prompt({
            choices: [rp8, rp9],
            message: 'Which version of Axure do you want to serve?',
            name: 'rpVersion',
            type: 'checkbox'
        }, (selection) => {
            const {
                rpVersion
            } = selection;

            browserSync.init({
                ...browserSyncConfig,
                proxy: rpVersion[0] === rp8 ? proxyRP8 : proxyRP9
            });
        }));
});
