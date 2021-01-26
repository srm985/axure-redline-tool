const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = require('./config');

const WatchBundlePlugin = require('./scripts/WatchBundlePlugin');

const {
    directories: {
        srcDirectory
    },
    buildTypes: {
        development,
        production
    },
    bundleName
} = config();

module.exports = () => {
    const {
        env: {
            INJECTED = false,
            NODE_ENV = production
        }
    } = process;

    const isInjectedEnvironment = INJECTED === 'true';
    const isProduction = NODE_ENV !== development;

    const plugins = [
        new CleanWebpackPlugin(),
        new WatchBundlePlugin({
            isInjectedEnvironment
        })
    ];

    if (!isInjectedEnvironment && !isProduction) {
        plugins.push(new HtmlWebpackPlugin({
            template: `${srcDirectory}/index.html`
        }));
    }

    return {
        devServer: {
            contentBase: path.join(__dirname, '../dist/'),
            historyApiFallback: true,
            hot: true
        },
        devtool: !isProduction ? 'source-map' : undefined,
        entry: [
            `${srcDirectory}/index.js`
        ],
        mode: NODE_ENV,
        module: {
            rules: [
                {
                    exclude: /node_modules/,
                    test: /\.(js|jsx)$/,
                    use: [
                        'babel-loader'
                    ]
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
                },
                {
                    loader: 'svg-inline-loader',
                    test: /\.svg$/
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
