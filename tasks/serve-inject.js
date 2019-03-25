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
    rp9: 'Serve RP9',
    rp9Inspect: 'Serve RP9 With Inspect Tool'
};

gulp.task(serveInject, (done) => {
    const {
        rp8,
        rp9,
        rp9Inspect
    } = rpVersionChoices;

    const {
        proxyRP8,
        proxyRP9,
        proxyRP9Inspect
    } = browserSyncConfig;

    inquirer.prompt({
        choices: [
            rp8,
            rp9,
            rp9Inspect
        ],
        message: 'Which version of Axure do you want to serve?',
        name: 'rpVersion',
        type: 'checkbox'
    }).then((selection) => {
        const {
            rpVersion
        } = selection;

        let proxy;

        switch (rpVersion[0]) {
            case rp8:
                proxy = proxyRP8;
                break;
            case rp9:
                proxy = proxyRP9;
                break;
            case rp9Inspect:
                proxy = proxyRP9Inspect;
                break;
            default:
                proxy = proxyRP8;
        }

        browserSync.init({
            ...browserSyncConfig,
            proxy
        });

        done();
    });
});
