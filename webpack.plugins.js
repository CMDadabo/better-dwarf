const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

let copyPatterns;

if (process.env.BUILD_PRODUCTION) {
    copyPatterns = [];
} else {
    copyPatterns = [
        {
            // Workaround: Copy native_modules in some directory where it's found
            from: path.resolve(__dirname, "native_modules/build"),
            to: path.resolve(__dirname, "out/"),
        },
    ];
}

module.exports = [
    new ForkTsCheckerWebpackPlugin(),
    new CopyWebpackPlugin({
        patterns: copyPatterns,
    }),
];
