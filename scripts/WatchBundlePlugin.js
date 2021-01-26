const browserSync = require('browser-sync');
const fs = require('fs');

const {
    bundleName,
    directories: {
        distDirectory,
        legacyWebDirectory
    },
    legacyBundleName
} = require('../config')();

class WatchBundlePlugin {
    constructor(options = {}) {
        const {
            isInjectedEnvironment,
            isProduction
        } = options;

        this.isInjectedEnvironment = isInjectedEnvironment;
        this.isProduction = isProduction;
    }

    apply = (compiler) => {
        compiler.hooks.afterEmit.tap('WatchBundlePlugin', () => {
            if (this.isInjectedEnvironment) {
                browserSync.reload();
            } else if (this.isProduction) {
                fs.readFile(`${distDirectory}/${bundleName}.js`, (error, fileContents) => {
                    const wrappedFile = `<script>${fileContents}</script>`;

                    // Write out our file used for copy and paste into AxShare.
                    console.log('Repackaging into copy & paste module...');
                    fs.writeFile(`${distDirectory}/${bundleName}.txt`, wrappedFile, () => {});

                    // Write out our CDN-served file to legacy directory to prevent breaking changes from V2.
                    console.log('Repackaging into legacy support module...');
                    fs.writeFile(`${legacyWebDirectory}/${legacyBundleName}.js`, fileContents, () => {});
                });
            }
        });
    }
}

module.exports = WatchBundlePlugin;
