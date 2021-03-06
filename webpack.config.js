const webpack = require('webpack');
const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;

const common = {
	entry: {
		weather: './app/index.js',
	},
	output: {
		path: '/build/js/',
		publicPath: '/js/',
		filename: '[name].js',
	},
	resolve: {
		modulesDirectories: ['node_modules', 'bower_components', 'build'],
	},
	devtool: 'source-map',
	watch: true,
	devServer: {
		contentBase: 'build/',
		progress: true,
		stats: 'errors-only',
		port: '8824',
		host: '0.0.0.0',
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015', 'stage-0'],
					plugins: ['transform-decorators-legacy'],
				},
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev'),
		}),
	],
};

// DEV CONFIG
if(TARGET !== 'build') {
	module.exports = common;
}

// PROD CONFIG
if(TARGET === 'build' || TARGET === 'publish' ) {
	module.exports = merge(common, {
		watch: false,
	});
}


