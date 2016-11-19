var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');

gulp.task('compile-coffee', function() {
    gulp.src(['src/*.coffee'])
        .pipe(coffee())
        .pipe(concat('cagen.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.watch('src/*.coffee', ['compile-coffee']);
});