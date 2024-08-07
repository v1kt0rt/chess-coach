"use strict"
const { VueLoaderPlugin } = require("vue-loader")

module.exports = {
	entry: {
		"frontend": "./src/frontend-main.js"
	},
	output: {
		filename: "[name].js"
	},
	externals: {
		vue: 'Vue'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: "babel-loader"
		},
		{
			test: /\.vue$/,
			exclude: /node_modules/,
			use: "vue-loader"
		},

		{
			test: /\.css$/,
			use: [
				"vue-style-loader",
				"css-loader"
			]
		}]
	},
	plugins: [
		new VueLoaderPlugin()
	]
}