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
    webpackConfig: '../webpack.config.js'
});
