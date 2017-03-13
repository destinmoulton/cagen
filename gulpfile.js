var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var hoganCompiler = require('gulp-hogan-precompile');
var declare = require('gulp-declare');
var uglify = require('gulp-uglify');

var coffeeFiles = [
    'src/Bus.coffee',
    'src/DOM.coffee',
    'src/Board.coffee',
    'src/Generator.coffee',
    'src/RuleMatcher.coffee',
    'src/Thumbnails.coffee',
    'src/Tabs.coffee',
    'src/TopRowEditor.coffee',
    'src/WolfCage.coffee'
];

gulp.task('compile-coffee', function() {
    gulp.src(coffeeFiles)
        .pipe(sourcemaps.init())
        .pipe(coffee({bare:true}))
        .pipe(sourcemaps.write())
        .pipe(concat('wolfcage.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('compile-templates', function() {
  gulp.src('templates/**/*.mustache')
      .pipe(hoganCompiler())
      .pipe(declare({
        namespace: 'templates',
        noRedeclare: true
      }))
      .pipe(concat('wolfcage.templates.js'))
      .pipe(gulp.dest('./dist'));
});

gulp.task('watch-coffee', function() {
    gulp.start('compile-coffee');
    gulp.watch('src/*.coffee', ['compile-coffee']);
});

gulp.task('minify-js', function(){
    gulp.src(['dist/wolfcage.templates.js', 'dist/wolfcage.js'])
        .pipe(concat('wolfcage.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});