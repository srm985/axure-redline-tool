const browserSync = require('browser-sync');
const gulp = require('gulp');
const log = require('fancy-log');
const webpack = require('webpack');

const {
    buildTypes: {
        production
    },
    environmentalVariables: {
        buildEnvironment,
        injectedEnvironment
    },
    tasks: {
        bundle,
        generatePlugin
    },
    webpackConfig
} = require('../gulp.config.js')();

gulp.task(bundle, (callback) => {
    const environment = process.env[buildEnvironment];
    const isInjected = process.env[injectedEnvironment];
    const webpackConfigObject = require(webpackConfig)(); // eslint-disable-line global-require

    webpack(webpackConfigObject, (err) => {
        if (err) {
            throw log('webpack', err);
        }

        log('Webpack: Bundled');

        if (isInjected) {
            browserSync.reload();
        } else {
            gulp.start(generatePlugin);
        }

        if (environment === production) {
            callback();
        } else {
            log('Webpack: Watching...');
        }
    });
});
