var gulp = require("gulp");
var concat = require("gulp-concat");
var declare = require("gulp-declare");
var uglify = require("gulp-uglify");
var header = require("gulp-header");
const rename = require("gulp-rename");
const browserify = require("gulp-browserify");
const sass = require("gulp-sass");

var pkg = require("./package.json");
var banner = [
    "/**",
    " * <%= pkg.name %> - <%= pkg.description %>",
    " * @author <%= pkg.author %>",
    " * @version v<%= pkg.version %>",
    " * @link <%= pkg.homepage %>",
    " * @license <%= pkg.license %>",
    " */",
    ""
].join("\n");

gulp.task("compile:coffee", function() {
    return gulp
        .src("src/WolfCage.coffee", { read: false })
        .pipe(
            browserify({
                debug: true,
                transform: ["coffeeify"],
                extensions: [".coffee"]
            })
        )
        .pipe(rename("wolfcage.js"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("compile:sass", function() {
    return gulp
        .src("src/wolfcage.scss")
        .pipe(sass())
        .pipe(header(banner, { pkg }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("watch", function() {
    gulp.watch(
        "src/wolfcage.scss",
        { ignoreInitial: false },
        gulp.series(["compile:sass"])
    );

    gulp.watch(
        "src/*.coffee",
        { ignoreInitial: false },
        gulp.series(["compile:coffee"])
    );
});

gulp.task("uglify-js", function() {
    gulp.src(["dist/wolfcage.templates.js", "dist/wolfcage.js"])
        .pipe(concat("wolfcage.min.js"))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest("./dist"));
});
