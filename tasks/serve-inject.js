const browserSync = require('browser-sync');
const gulp = require('gulp');
const inquirer = require('inquirer');

const {
    browserSyncConfig,
    tasks: {
        serveInject
    }
} = require('../gulp.config.js')();

const rpVersionChoices = {
    rp8: 'Serve RP8',
    rp9: 'Serve RP9'
};

gulp.task(serveInject, (done) => {
    const {
        rp8,
        rp9
    } = rpVersionChoices;

    const {
        proxyRP8,
        proxyRP9
    } = browserSyncConfig;

    inquirer.prompt({
        choices: [rp8, rp9],
        message: 'Which version of Axure do you want to serve?',
        name: 'rpVersion',
        type: 'checkbox'
    }).then((selection) => {
        const {
            rpVersion
        } = selection;

        browserSync.init({
            ...browserSyncConfig,
            proxy: rpVersion[0] === rp8 ? proxyRP8 : proxyRP9
        });

        done();
    });
});
