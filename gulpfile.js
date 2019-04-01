var gulp = require("gulp");
var concat = require("gulp-concat");
var hoganCompiler = require("gulp-hogan-precompile");
var declare = require("gulp-declare");
var uglify = require("gulp-uglify");
var header = require("gulp-header");
const rename = require("gulp-rename");
const browserify = require("gulp-browserify");

gulp.task("compile-coffee", function() {
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

gulp.task("compile-templates", function() {
    return gulp
        .src("templates/**/*.mustache")
        .pipe(hoganCompiler())
        .pipe(
            declare({
                namespace: "templates",
                noRedeclare: true
            })
        )
        .pipe(concat("wolfcage.templates.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("watch-coffee", function() {
    gulp.watch(
        "src/*.coffee",
        { ignoreInitial: false },
        gulp.series(["compile-coffee"])
    );
});

gulp.task("watch-templates", function() {
    gulp.start("compile-templates");
    gulp.watch("templates/*.mustache", ["compile-templates"]);
});

gulp.task("watch-both", function() {
    gulp.start("watch-coffee");
    gulp.start("watch-templates");
});

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

gulp.task("uglify-js", function() {
    gulp.src(["dist/wolfcage.templates.js", "dist/wolfcage.js"])
        .pipe(concat("wolfcage.min.js"))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest("./dist"));
});
