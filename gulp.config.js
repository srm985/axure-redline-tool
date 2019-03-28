module.exports = () => ({
    browserSyncConfig: {
        ghostMode: true,
        https: true,
        logConnections: true,
        logLevel: 'debug',
        logPrefix: 'Redline Tool',
        open: true,
        port: 3100,
        proxyRP8: 'https://tqap6c.axshare.com',
        proxyRP9: 'https://98t4tt.axshare.com',
        proxyRP9Inspect: 'https://tlslxj.axshare.com/#id=dnhnlp&p=page_1',
        reloadDebounce: 250,
        reloadDelay: 50,
        reloadOnRestart: true,
        serveStatic: ['dist'],
        snippetOptions: {
            rule: {
                fn: (snippet, match) => `<script src="plugin.js"></script>${snippet}${match}`,
                match: /<\/head>/i
            }
        },
        ui: {
            port: 3101
        }
    },
    buildTypes: {
        development: 'development',
        production: 'production'
    },
    bundleName: 'plugin',
    configFiles: {
        sassConfig: './.sasslintrc'
    },
    directories: {
        distDirectory: './dist',
        legacyWebDirectory: './web',
        rootDirectory: './',
        srcDirectory: './src',
        tasksDirectory: './tasks'
    },
    environmentalVariables: {
        buildEnvironment: 'BUILD_ENVIRONMENT',
        injectedEnvironment: 'INJECTED_ENVIRONMENT'
    },
    legacyBundleName: 'axure-redline-plugin',
    packageJSON: './package.json',
    tasks: {
        bumpVersion: 'bump-version',
        bundle: 'bundle',
        cleanDist: 'clean',
        generatePlugin: 'generate-plugin',
        legacySupport: 'legacy-support',
        lintCSS: 'lint-css',
        lintJS: 'lint-js',
        serveInject: 'serve-inject',
        serveSandbox: 'serve-sandbox',
        watch: 'watch'
    },
    webpackConfig: '../webpack.config.js'
});
