const browserSync = require('browser-sync');
const inquirer = require('inquirer');
const webpack = require('webpack');

const config = require('../config');

const {
    browserSyncConfig,
    webpackConfig
} = config();

const rpVersionChoices = {
    promptInput: 'Serve Custom URL',
    rp8: 'Serve RP8',
    rp9: 'Serve RP9'
};

const handlePrompt = async () => {
    const {
        promptInput,
        rp8,
        rp9
    } = rpVersionChoices;

    return inquirer.prompt({
        choices: [
            rp8,
            rp9,
            promptInput
        ],
        message: 'Which version of Axure do you want to serve?',
        name: 'rpVersion',
        type: 'checkbox'
    });
};

const handlePromptCustomURL = async () => {
    const {
        proxyInput
    } = await inquirer.prompt({
        message: 'Please enter custom AxShare URL.',
        name: 'proxyInput',
        type: 'input'
    });

    return proxyInput;
};

const serveInject = async () => {
    const {
        rp8,
        rp9
    } = rpVersionChoices;

    const {
        proxyRP8,
        proxyRP9
    } = browserSyncConfig;

    const {
        rpVersion: [
            promptSelection
        ] = []
    } = await handlePrompt();

    let proxyURL = '';

    if (promptSelection === rp8) {
        proxyURL = proxyRP8;
    } else if (promptSelection === rp9) {
        proxyURL = proxyRP9;
    } else {
        proxyURL = await handlePromptCustomURL();
    }

    browserSync.init({
        ...browserSyncConfig,
        proxy: proxyURL
    }, () => {
        process.env.NODE_ENV = 'development';
        process.env.INJECTED = true;

        const webpackConfigObject = require(webpackConfig)(); // eslint-disable-line global-require

        webpack(webpackConfigObject, (error) => {
            console.log(error);
        });
    });
};

serveInject();
