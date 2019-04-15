var gulp = require("gulp");
const babel = require("gulp-babel");
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

gulp.task("compile:dev", function() {
    return gulp
        .src("src/WolfCage.coffee", { read: false })
        .pipe(
            browserify({
                debug: true,
                transform: ["coffeeify"],
                extensions: [".coffee"]
            })
        )
        .pipe(rename("wolfcage.dev.js"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("compile:es5", function() {
    return gulp
        .src("src/WolfCage.coffee", { read: false })
        .pipe(
            browserify({
                debug: false,
                transform: ["coffeeify"],
                extensions: [".coffee"]
            })
        )
        .pipe(
            babel({
                presets: ["@babel/env"]
            })
        )
        .pipe(rename("wolfcage.es5.js"))
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
        "src/**/*.coffee",
        { ignoreInitial: false },
        gulp.series(["compile:dev"])
    );
});

gulp.task("uglify", function() {
    return gulp
        .src("dist/wolfcage.es5.js")
        .pipe(
            babel({
                presets: ["@babel/env"]
            })
        )
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename("wolfcage.min.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("build", gulp.series(["compile:es5", "compile:sass", "uglify"]));
