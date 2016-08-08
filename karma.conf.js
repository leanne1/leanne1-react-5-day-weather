var envify = require('loose-envify/custom');
module.exports = function(config) {
	config.set({

		basePath: '',

		browsers: ['PhantomJS'],

		frameworks: ['browserify', 'mocha'],

		files: [
			'node_modules/whatwg-fetch/fetch.js',
			'node_modules/babel-es6-polyfill/browser-polyfill.js',
			'test/unit/helpers/polyfill/fn.bind.js',
			'test/unit/helpers/polyfill/el.classList.js',
			'test/unit/helpers/polyfill/Array.includes.js',
			'test/unit/specs/**/*.js',
		],

		exclude: [
		],

		preprocessors: {
			'test/unit/**/*.js': ['browserify'],
		},
		browserify: {
			debug: true,
			transform: [
				['babelify'],
				[envify({
					NODE_ENV: 'production', // set to prod to disable redux logging
				}), {
					global: true,
				}],
			],
			configure: function(bundle) {
				bundle.on('prebundle', function() {
					bundle.external('react/addons');
					bundle.external('react/lib/ReactContext');
					bundle.external('react/lib/ExecutionEnvironment');
				});
			},
			paths: [
				'node_modules',
				'bower_components/',
				'test/unit/',
			],
		},

		reporters: ['mocha'],

		plugins: [
			'karma-mocha',
			'karma-phantomjs-launcher',
			'karma-mocha-reporter',
			'karma-browserify',
		],
	});
};
