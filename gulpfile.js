var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	jade = require('gulp-jade'),
	webserver = require('gulp-webserver'),
	concat = require('gulp-concat'),
	fontmin = require('gulp-fontmin'),
	shelljs = require('shelljs');

var styles = [
	'src/scss/style.scss'
];

var skrollr = [
	'src/scss/skrollr.css'
];

var scripts = [
	// zeptojs
	'src/vendor/zeptojs/src/zepto.js',
	//'src/vendor/zeptojs/src/data.js',
	'src/vendor/zeptojs/src/event.js',
	'src/vendor/zeptojs/src/ie.js',
	'src/js/main.js',
	// skrollr
	'src/vendor/skrollr-stylesheets/src/skrollr.stylesheets.js',
	'src/vendor/skrollr/src/skrollr.js'
];

var jades = [
	'src/jade/*.jade'
];

gulp.task('styles', function () {
	'use strict';
	return gulp.src(styles)
		.pipe(sass())
		.pipe(concat('style.css'))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('output/css'));
});

gulp.task('skrollr', function () {
	'use strict';
	return gulp.src(skrollr)
		//.pipe(sass())
		//.pipe(concat('skrollr.css'))
		.pipe(rename({suffix: '.min'}))
		//.pipe(minifycss({restructuring: false, compatibility: '-properties.zeroUnits'}))
		.pipe(gulp.dest('output/css'));
});

gulp.task('scripts', function () {
	'use strict';
	return gulp.src(scripts)
		.pipe(concat('main.js'))
		.pipe(rename({suffix: '.min'}))
		//.pipe(uglify())
		.pipe(gulp.dest('output/js'));
});

gulp.task('jades', function () {
	'use strict';
	return gulp.src(jades)
		.pipe(jade())
		.pipe(gulp.dest('output/'));
});


gulp.task('copy', function () {
	'use strict';
	return gulp.src('src/static/**/*')
		.pipe(gulp.dest('output'));
});

gulp.task('font', function () {
	return gulp.src('src/fonts/*.ttf')
		.pipe(fontmin({
			text: 'BiKaiTimelineSkillsHobbiesConnectProjects'
		}))
		.pipe(gulp.dest('src/static/font'));
});

gulp.task('webserver', function () {
	gulp.src('output')
		.pipe(webserver({
			host: '0.0.0.0',
			port: 5000,
			livereload: true,
			directoryListing: true,
			open: 'http://127.0.0.1:5000/index.html'
		}));
});

gulp.task('build', ['styles', 'skrollr', 'scripts', 'jades', 'font'], function () {
	gulp.start('copy');
});

gulp.task('default', ['styles', 'skrollr', 'scripts', 'jades', 'copy', 'webserver'], function () {
	'use strict';
	gulp.watch('src/scss/**/*.scss', ['styles']);
	gulp.watch('src/scss/skrollr.css', ['skrollr']);
	gulp.watch(scripts, ['scripts']);
	gulp.watch('src/jade/**/*.jade', ['jades']);
});
