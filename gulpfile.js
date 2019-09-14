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

// 这种写配置的方法都不忍心看了
var styles = [
    'src/scss/style.scss'
];

var skrollr = [
    'src/skrollr/skrollr.css',
    'src/skrollr/skrollr-lg.css'
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

gulp.task('styles', function() {
    'use strict';
    return gulp.src(styles)
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({
        suffix: '.min'
    }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('skrollr', function() {
    'use strict';
    return gulp.src(skrollr)
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(minifycss({
        restructuring: false,
        compatibility: '-properties.zeroUnits'
    }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
    'use strict';
    return gulp.src(scripts)
    .pipe(concat('main.js'))
    .pipe(rename({
        suffix: '.min'
    }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('jades', function() {
    'use strict';
    return gulp.src(jades)
    .pipe(jade())
    .pipe(gulp.dest('dist/'));
});


gulp.task('copy', function() {
    'use strict';
    return gulp.src('src/static/**/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('font', function() {

    // Muli
    gulp.src('src/fonts/Muli*.ttf')
    .pipe(fontmin())
    .pipe(gulp.dest('src/static/font'));

    // Fredericka-the-Great
    gulp.src('src/fonts/Fredericka-the-Great.ttf')
        .pipe(fontmin({
            text: '1234590Haowu Ge Timeline Skills Hobbies Connect Projects'
        }))
        .pipe(gulp.dest('src/static/font'));
});

gulp.task('webserver', function() {
    return gulp.src('dist')
        .pipe(webserver({
            host: '0.0.0.0',
            port: 5000,
            livereload: true,
            directoryListing: true,
            open: 'http://127.0.0.1:5000/index.html'
        }));
});

gulp.task('build', ['styles', 'skrollr', 'scripts', 'jades', 'font'], function() {
    return gulp.start('copy');
});

gulp.task('git', function() {

    // gulp git -m test
    var commit = process.argv[4];

    shelljs.exec('git add -A .; git commit -m "' + commit + '"; git push gitcafe master ; git push github master');
});

gulp.task('publish', ['build'], function() {

    // gulp publish
    shelljs.exec('cd dist; git add -A  .; git commit -m "auto publish"; git push gitcafe gh-pages ; git push github gh-pages; cd ..');
});

gulp.task('default', ['font', 'styles', 'skrollr', 'scripts', 'jades', 'copy', 'webserver'], function() {
    'use strict';
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/skrollr/*.css', ['skrollr']);
    gulp.watch(scripts, ['scripts']);
    gulp.watch('src/jade/**/*.jade', ['jades']);
});
