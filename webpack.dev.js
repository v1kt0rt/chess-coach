const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "development",
	devtool: "#eval-source-map",
	devServer: {
		port: 8240,
		contentBase: [
			"./dist"
		],
		historyApiFallback: {
			rewrites: [
				{ from: "/", to: "/frontend.html" }
			]
		}
	}
});