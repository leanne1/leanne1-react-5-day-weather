var gulp = require('gulp');
var less = require('gulp-less');
var csslint = require('gulp-csslint');
var autoprefixer = require('gulp-autoprefixer');
var reporter = require('gulp-less-reporter');
var minifyCss = require('gulp-minify-css');
var htmlhint = require('gulp-htmlhint');
var lessBower = require('less-plugin-bower-resolve');
var lessNPM = require('less-plugin-npm-import');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var Server = require('karma').Server;
var eslint = require('gulp-eslint');
var del = require('del');
var todo = require('gulp-todo');
var flatten = require('gulp-flatten');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var ghPages = require('gulp-gh-pages');
var gulpWebpack = require('gulp-webpack');

//++++++++++++++++++++++++
// + CLI tasks [public]
//++++++++++++++++++++++++

// These are the tasks you should run up from the command line
gulp.task('default', function( callback ) {
	runSequence(
		[
			'clean:build',
		],
		[
			'copy:package-bundles',
			'copy:package-fonts',
			'copy:html',
		],
		[
			'modules:site-less',
			'watch:html',
			'watch:less',
		],
		[
			'test',
		]
		, callback);
});

gulp.task('build', function( callback ) {
	runSequence(
		['clean:build'],
		[
			'copy:package-bundles',
			'copy:package-fonts',
			'copy:html',
			'modules:site-less',
			'modules:site-js'
		]
		, callback)
});

gulp.task('publish', function( callback ) {
	runSequence(
		['build'],
		['publish:deploy']
		, callback)
});

//++++++++++++++++++++++
// + Publish
//++++++++++++++++++++++

gulp.task('publish:deploy', function() {
	return gulp.src('./build/**/*')
		.pipe(ghPages());
});

//++++++++++++++++++++++
// + Less
//++++++++++++++++++++++

var bundleSiteCssDebug = 'weather.debug.css';

// Note: works with ./browserslist and ./csslintrc.json
function lessModules(sourceFiles, bundleDebugName) {
	gulp.src(sourceFiles)
		.pipe(less({
			plugins: [lessBower, new lessNPM()]
		}))
		.on('error', function(err){
			gutil.log(gutil.colors.red(Error('Less Error: ') + err.message));
			this.emit('end');
		})
		.pipe(autoprefixer())
		.pipe(csslint('./csslintrc.json'))
		.pipe(csslint.reporter())
		.pipe(rename(bundleDebugName))
		.pipe(gulp.dest('./build/css'))
		.pipe(rename(bundleDebugName.replace('debug', 'min')))
		.pipe(sourcemaps.init())
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build/css'));
}

gulp.task('modules:site-less', function() {
	lessModules(['./styles/weather.less'], bundleSiteCssDebug);
});

//++++++++++++++++++++++
// + Lint
//++++++++++++++++++++++

gulp.task('lint:js', function() {
	return gulp.src(['./app/**/*js'])
		.pipe(eslint())
		.pipe(eslint.format());
});

//++++++++++++++++++++++
// + Copy
//++++++++++++++++++++++

gulp.task('copy:html', function() {
	return gulp.src('./app/**.html')
		.pipe(gulp.dest('./build/'));
});

gulp.task('copy:package-bundles', function() {
	return gulp.src([
		'./package/global.min.css',
		'./package/weather-icons.min.css',
		'./package/global.min.css.map',
		'./package/global.min.js',
		'./package/global.min.js.map',
		'./bower_components/bootstrap/dist/css/bootstrap.min.css',
		'./bower_components/bootstrap/dist/css/bootstrap.min.css.map'
	])
		.pipe(gulp.dest('./build/package/'));
});

gulp.task('copy:package-fonts', function() {
	return gulp.src([
			'./package/font/weathericons-regular-webfont.*',
		])
		.pipe(gulp.dest('./build/font/'));
});

//++++++++++++++++++++++
// + Javascript
//++++++++++++++++++++++
gulp.task('modules:site-js', function() {
	var webpackConfig = require('./webpack.config.js');
	return gulp.src('./app/index.js')
		.pipe(gulpWebpack(webpackConfig))
		.pipe(gulp.dest('./build/js/'));
});

//++++++++++++++++++++++
// + Clean
//++++++++++++++++++++++

gulp.task('clean:build', function( callback ) {
	del(['./build/'], callback);
});

//++++++++++++++++++++++
// + Test
//++++++++++++++++++++++

function doTests(karmaConfig, building, done){
	Server.start({
		configFile: __dirname + karmaConfig,
		autoWatch: !building,
		singleRun: !!building,
	}, function(result){
		if (result === 1 && building){
			gutil.log(gutil.colors.bgRed(new Error('Failing tests. Please fix tests before continuing ')));
		} else {
			done();
		}
	});
}

// TDD test task

// Pre-release test task
gulp.task('test', function(done) {
	doTests('/karma.conf.js', true, done);
});

// Build test task
gulp.task('test:build', function(done) {
	doTests('/karma.conf.js', false, done);
});


//++++++++++++++++++++++
// + Watch
//++++++++++++++++++++++

gulp.task('watch:less', function() {
	return gulp.watch([
		'styles/**/*.less',
	], ['modules:site-less']);
});

gulp.task('watch:html', function() {
	return gulp.watch([
		'app/**/*.html',
	], ['copy:html']);
});

gulp.task('watch:js', function() {
	return gulp.watch([
		'app/**/*.js',
	], ['lint:js']);
});
