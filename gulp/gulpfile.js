// 配置
const config = require('./config');
const gulp = require('gulp');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync'); // 浏览器 预览
const notify = require('gulp-notify'); // 处理报错而不终止
const changed = require('gulp-changed');//处理变化文件
const del = require('del'); // 删除
// html处理
const htmlmin = require('gulp-htmlmin'); // html 压缩
const fileinclude = require('gulp-file-include');
// var minifyHTML   = require('gulp-minify-html');
// css处理
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
// js处理
const babel = require('gulp-babel'); // #使用了webpack就不能使用gulp处理（不能引入）
const uglify = require('gulp-uglify'); //js压缩
// image处理
const imagemin = require('gulp-imagemin');
// 版本控制
const runSequence = require('run-sequence');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');

// ------------------------- 开发环境 -------------------------
let env = gulp.env._[0];
console.log('首次执行环境',env);
gulp.task('default', ['dev']);
// 执行打包发布任务
gulp.task('pro', ['pro']);

// 清除
gulp.task('del',function (cb) {
    del([ config.clean.src ],{force: true}, cb);
});

// 处理css
gulp.task('css', function () {
    return gulp.src(config.dev.sass.src)
        .pipe(changed(config.dev.sass.dest))
        .pipe(rev())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({
            compatibility: 'ie8',
            rebase :false
        }))
        .pipe( sass().on('error', notify.onError(function (error) {
                return "Message to the notifier: " + error.message;
            })
        ))
        .pipe(gulp.dest(config.dev.sass.dest))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( config.dev.sass.dest+'/hash' ) );
});

// 处理脚本
gulp.task('script', function () {
    return gulp.src( config.dev.js.src )
        .pipe( changed(config.dev.js.dest) )
        .pipe( sourcemaps.init() )
        .pipe( rev() )
        .pipe( babel( { presets: ['es2015'] }) )
        .pipe( uglify() )
        .pipe( gulp.dest(config.dev.js.dest) )
        .pipe( rev.manifest() )
        .pipe( gulp.dest( config.dev.js.dest +'/hash' ) )
        .pipe( sourcemaps.write('./maps') )
});
// 处理html
gulp.task('html', function () {
    return gulp.src(['build/**/*.json', config.dev.html.src])
        .pipe(changed(config.dev.html.src))
        // 合并模板 
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin( { collapseWhitespace: env==='pro' ? true : false } ))
        .pipe( revCollector({
            replaceReved: true, //替换模板文件中的链接
            dirReplacements: {
                'style/': 'style/',
                'js/': 'js/'
            }
        }) )
        .pipe( gulp.dest(config.dev.html.dest) );
});
// 处理page
gulp.task('page', function () {
    return gulp.src(['build/**/*.json', config.dev.page.src])
        .pipe(changed(config.dev.page.src))
        // 合并模板 
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin( { collapseWhitespace: env==='pro' ? true : false } ))
        .pipe( revCollector({
            replaceReved: true, //替换模板文件中的链接
            dirReplacements: {
                'style/': 'style/',
                'js/': 'js/'
            }
        }) )
        .pipe( gulp.dest(config.dev.page.dest) );
});
// 直接输出
gulp.task('common', function() {
    gulp.src(config.dev.common.src)
        .pipe(gulp.dest(config.dev.common.dest))
});
gulp.task('images', function() {
    gulp.src(config.dev.img.src)
        .pipe(changed(config.dev.img.dest))
        .pipe(imagemin())
        .pipe(gulp.dest(config.dev.img.dest))
});
gulp.task('plugins', function() {
    gulp.src(config.dev.plugin.src)
        .pipe(gulp.dest(config.dev.plugin.dest))
});


// 本地开发
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
        ['css'],
        ['script'],
        ['html','page'],
        ['common','images','plugins','watch','browser-sync'],
        done);
});

// 实时预览
// browser-sync
gulp.task('browser-sync',function(){
    browserSync.init({
        server: {
            baseDir: "./",
            index: '/'
        },
        open:false,
        port: 1234
    });
});
// 监听
// watch
gulp.task('watch',function(){
    gulp.watch(config.dev.sass.src, ['watchDevCss']);
    gulp.watch(config.dev.js.src, ['watchDevJs']);
    gulp.watch(config.dev.html.src, ['html']).on("change", browserSync.reload);
    gulp.watch(config.dev.page.src, ['page']).on("change", browserSync.reload);
});

gulp.task('watchDevCss', function (done) {
    condition = false;
    runSequence(
        ['css'],
        ['html'],
        done);
});
gulp.task('watchDevJs', function (done) {
    condition = false;
    runSequence(
        ['script'],
        ['html'],
        done);
});
