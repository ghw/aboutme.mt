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
    gulp.src('src/fonts/Alibaba-PuHuiTi-Regular.ttf')
    //gulp.src('src/fonts/Fredericka-the-Great.ttf')
        .pipe(fontmin({
            text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890,.;，。；-&葛豪武 浙备号比特萌·信息✬公网安备©嗨，我是葛豪武致力商务智能&时光荏苒联合创始人/分析师深圳比特萌信息技术有限公司成本会计（工业）浙江??电器有限公司主办会计（工业）浙江??机械股份有限公司主办会计（商业）杭州??医学仪器有限公司税务会计/财务助理浙江??药业有限公司会计学浙江财经学院出生你好，世界！薄技在身日常账务处理财务会计电算化企政报表编制报送企业经营状况预测金蝶KIS实施部署操作系统运行维护中间件部署实施图形图像处理发票,审核,凭证,报表金蝶,用友,SAP,Excel国地税,工商,统计,外管财务状况分析建账,ERP实施部署公诸同好信息技术安全互联数据分析不解之缘B'
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
