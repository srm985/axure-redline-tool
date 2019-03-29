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
    promptInput: 'Serve Custom URL',
    rp8: 'Serve RP8',
    rp9: 'Serve RP9'
};

gulp.task(serveInject, (done) => {
    const {
        rp8,
        rp9,
        promptInput
    } = rpVersionChoices;

    const {
        proxyRP8,
        proxyRP9
    } = browserSyncConfig;

    const handlePromptInput = () => new Promise((resolve) => {
        inquirer.prompt({
            message: 'Please enter custom AxShare URL.',
            name: 'proxyInput',
            type: 'input'
        }).then((inputValue) => {
            const {
                proxyInput
            } = inputValue;

            resolve(proxyInput);
        });
    });

    inquirer.prompt({
        choices: [
            rp8,
            rp9,
            promptInput
        ],
        message: 'Which version of Axure do you want to serve?',
        name: 'rpVersion',
        type: 'checkbox'
    }).then((selection) => {
        const {
            rpVersion
        } = selection;

        const [
            promptSelection
        ] = rpVersion;

        new Promise((resolve) => {
            if (promptSelection === rp8) {
                resolve(proxyRP8);
            } else if (promptSelection === rp9) {
                resolve(proxyRP9);
            } else if (promptSelection === promptInput) {
                handlePromptInput().then((proxyInput) => {
                    resolve(proxyInput);
                });
            }
        }).then((proxy) => {
            browserSync.init({
                ...browserSyncConfig,
                proxy
            });

            done();
        });
    });
});
