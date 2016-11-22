var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');

var coffeeFiles = [
    'src/Variables.coffee',
    'src/DOM.coffee',
    'src/Board.coffee',
    'src/Generator.coffee',
    'src/RuleMatcher.coffee',
    'src/RuleThumbnails.coffee',
    'src/Tabs.coffee',
    'src/TopRowEditor.coffee',
    'src/Main.coffee'
];

gulp.task('compile-coffee', function() {
    gulp.src(coffeeFiles)
        .pipe(coffee({bare:true}))
        .pipe(concat('cagen.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.start('compile-coffee');
    gulp.watch('src/*.coffee', ['compile-coffee']);
});