// 配置
const gulp = require('gulp');
const watch = require('gulp-watch');
const fileinclude = require('gulp-file-include');
const babel = require('gulp-babel'); // #使用了webpack就不能使用gulp处理（不能引入）
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin'); // html 压缩
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync'); // 浏览器 预览
const notify = require('gulp-notify'); // 处理报错而不终止
const pump = require('pump');
const changed = require('gulp-changed');
const del = require('del'); // 删除
// 版本控制
const runSequence = require('run-sequence');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');


gulp.task('default', ['dev']);


 
gulp.task('css', function () {
    return gulp.src('dev/style/*.scss')
        .pipe(rev())
        .pipe( sass().on('error', notify.onError(function (error) {
                return "Message to the notifier: " + error.message;
            })
        ))
        .pipe(gulp.dest('build/css'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'build/css/hash' ) );
});
 
gulp.task('scripts', function () {
    return gulp.src('dev/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('build/js'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'build/js/hash' ) );
});
 
 
// var minifyHTML   = require('gulp-minify-html');
 
gulp.task('html', function () {
    return gulp.src(['build/**/*.json', 'dev/**/*.html'])
        .pipe( revCollector({
            replaceReved: true, //替换模板文件中的链接
            dirReplacements: {
                'style/': 'build/css/hash',
                'js/': 'build/js/hash'
            }
        }) )
        .pipe( gulp.dest('build') );
});


gulp.task('dev', function (done) {
    condition = false;
    runSequence(
        ['css'],
        ['scripts'],
        ['html'],
        done);
});


