const gulp = require('gulp');
// build 是本地
// build_PRO 是线上
let base = gulp.env._[0] !== 'pro' ? 'build' : 'build_PRO';

module.exports = {
    dev:{
        clean:{
            src: base 
        },
        html: {
            src:'./dev/*.html',
            dest: base+"/"
        },
        page: {
            src:'./dev/page/**/*.html',
            dest: base+"/page"
        },
        sass:{
            src :'./dev/style/**/*.scss',
            dest: base+"/style"       
        },
        js:{
            src :'./dev/js/**/*.js',
            dest: base+"/js"       
        },
        common:{
            src :'./dev/common/**/*',
            dest: base+"/common"       
        },
        plugin:{
            src :'./dev/plugins/**/*',
            dest: base+"/plugins"       
        },
        img:{
            src :'./dev/images/**/*',
            dest: base+"/images"       
        }
    },
    pro:{

    }
}