module.exports = {
    entry: "./src/client/exampleEnterpriseModel.js",
    output: {
        path: __dirname + "/public",
        library: ["agGridEnterpriseMysql"],
        libraryTarget: "umd",
        filename: "ag-grid-enterprise-mysql.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};