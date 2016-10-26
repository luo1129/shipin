var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var connect = require('gulp-connect')
var opn = require('opn')
var include = require('gulp-include')
var replace = require('gulp-replace')

gulp.task('sass', function() {
    gulp.src('sass/*.scss')
    	.pipe(include())
        .pipe(replace('px', 'rem/$base'))
        .pipe(replace('ssp', 'px'))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        //.pipe(changed('css'))
        .pipe(gulp.dest('css'))
        .pipe(replace("..","<%= image_url '"))
        .pipe(replace("/img/","custom/pub/"))
        .pipe(replace(".png",".png' %>"))
        .pipe(replace(".jpg",".jpg' %>"))
        .pipe(gulp.dest('lcss'))
        .pipe(connect.reload())
})
gulp.task('jade', function() {
    gulp.src('jade/*.jade')
        .pipe(jade({
            pretty: true
        }))
        //.pipe(changed('.'))
        .pipe(gulp.dest('.'))
        .pipe(connect.reload())
})
gulp.task('connect', function() {
    connect.server({
        root: '.',
        livereload: true,
        port: 2000,
        host: '127.0.0.1'
    })
    opn('http://' + '127.0.0.1' + ':' + 2000)
})

gulp.task('watch', function() {
    gulp.watch('sass/*.scss', ['sass'])
    gulp.watch('jade/*.jade', ['jade'])
})

gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    gulp.start(['sass', 'jade', 'watch', 'connect'])
});
