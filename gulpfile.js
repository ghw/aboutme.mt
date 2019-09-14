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
            text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890,.;，。；-&葛豪武 浙备号比特萌·信息✬公网安备©嗨，我是葛豪武致力于商务智能。&II.T.Also love the openBusinessIntelligence.timeline时光荏苒2018.11 - Date.now()联合创始人/BI分析师深圳比特萌信息技术有限公司2017.07 - 2018.11成本会计（工业）浙江??电器有限公司2016.02 - 2017.06主办会计（工业）浙江??机械股份有限公司2014.09 - 2016.01主办会计（商业）杭州??医学仪器有限公司2011.04 - 2014.09税务会计/财务助理浙江??药业有限公司2008.09 - 2011.06会计学浙江财经学院1990.02 - Date.now()出生你好，世界！skills薄技在身technology商务智能服务构建大数据设计及维护财务会计电算化企业经营状况分析操作系统运行维护图形图像处理moreSuperset,PowerBIPostgreSQL,OracleOdoo,SAP,KingdeeFinancialReportsUnix,Linux,WindowsPhotoshop,Illustratorhobbies公诸同好信息技术互联网络数据分析connect不解之缘gehaowu@bitmoe.comgehaowugehaowu.comCopyright © 2011-2019 Haowu Ge. All rights reserved.浙ICP备15014697号✬BitMOE比特萌·信息✬ 浙公网安备33010602000649号'
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
