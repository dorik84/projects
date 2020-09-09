let path = require("path");
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    // includes common plugins like uglify if set to production (to minimize JS code)
    mode: 'development',
    // source JS file (entry / output are called keys)
    entry: "./src/main.js",
    // output where all bundled JS will go(filename and path (made out of current directory/build))
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "build")
    },
    // setup webpack-dev-server to run our web app locally
    devServer: {
        contentBase: path.join(__dirname, "build"),
        writeToDisk: true,
        // activate this if you want the server to refresh when you mess with files in /build (not required normally)
        //watchContentBase: true,
        port:5000
    },
    // configuring webpack loaders - loaders let you run preprocessors on files as they are imported and bundled
    module: {
        // array of rules on handling certain files when bundling
        rules: [
            {
                // loader to handle transpiling JS with babel
                // look for all the files that end in .js
                test: /.js$/,
                exclude: /(node_modules)/,
                // specify which loader we want to use on these .js files
                use: {
                    loader: "babel-loader",
                    // babel transformations will be based on the environment that project is in
                    // need to include .babelrc configuration file in project
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                // will bundle all CSS files that are imported via JS into single bundle.css
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            },
            {
                // will pre-process all scss files that are imported via JS into single bundle.css
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{loader: 'css-loader', options: { url: false }}, 'sass-loader']
                })
            },
            {
                // will detect any fonts required by any CSS / SCSS files or are imported via JS
                // automatically copies the font files to /build/fonts for use
                // only works for local web fonts - google fonts do not get copied down
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      outputPath: 'fonts/'
                    }
                  }
                ]
            }
        ]
    },
    // plugins operate across all code
    plugins: [
        // removes inlined content from the javascript bundle and writes it to a separate file
        new ExtractTextPlugin('bundle.css'),
        new CopyWebpackPlugin([
            // copies all assets in the lib/ folder (images, etc) to /build
            {from:'lib/', to:''},
            // copies HTML file to /build
            {from:'html/index.html', to:'index.html'},
        ])
    ]
};