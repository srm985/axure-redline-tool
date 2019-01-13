const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const {
    directories: {
        srcDirectory
    },
    buildTypes: {
        development,
        production
    },
    bundleName,
    environmentalVariables: {
        buildEnvironment,
        injectedEnvironment
    }
} = require('./gulp.config.js')();

module.exports = () => {
    const environment = process.env[buildEnvironment] === production ? production : development;
    const isInjectedEnvironment = process.env[injectedEnvironment];
    const isProduction = environment === production;

    const plugins = [];

    if (!isInjectedEnvironment && !isProduction) {
        plugins.push(new HtmlWebpackPlugin({
            template: `${srcDirectory}/index.html`
        }));
    }

    return {
        devServer: {},
        devtool: !isProduction ? 'source-map' : '',
        entry: [
            `${srcDirectory}/index.js`
        ],
        mode: environment,
        module: {
            rules: [
                {
                    exclude: /node_modules/,
                    test: /\.js$/,
                    use: ['babel-loader']
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'style-loader'
                        }, {
                            loader: 'css-loader'
                        }, {
                            loader: 'sass-loader'
                        }
                    ]
                }
            ]
        },
        output: {
            filename: `${bundleName}.js`,
            path: path.resolve(__dirname, 'dist/')
        },
        plugins,
        resolve: {
            extensions: ['*', '.js', '.jsx']
        },
        watch: !isProduction
    };
};
