const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); // Updated for Dart Sass
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

const htmlMinifyRules = {
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true
};

// Preprocess SCSS into CSS
function compileSass() {
    return gulp
        .src('./source/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./assets/css'))
        .pipe(browserSync.stream());
}

// Move JS files
function scripts() {
    return gulp
        .src('./source/js/main.js', { allowEmpty: true })
        .pipe(gulp.dest('./assets/js'));
}

// Minify HTML files
function minifyHtml() {
    return gulp
        .src('./source/**/*.html')
        .pipe(htmlmin(htmlMinifyRules))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
}

// Watch files and serve
// Watch files and serve
function watch() {
    browserSync.init({
        server: {
            // Ensure this points to where your index.html is located
            baseDir: "./" 
        },
        // Optional: keeps the browser from opening a new tab every time you restart gulp
        open: true 
    });

    // Watch for changes in the source folder
    // Using './source' prefix ensures the file system watcher triggers correctly
    gulp.watch("./source/**/*.html", minifyHtml);
    gulp.watch("./source/scss/**/*.scss", compileSass);
    gulp.watch("./source/js/**/*.js", scripts);

    // Watch for changes in the output folder to trigger a reload
    // This is a backup to ensure if the tasks above finish, the browser refreshes
    gulp.watch(["./*.html", "./assets/css/*.css", "./assets/js/*.js"]).on("change", browserSync.reload);
}

// Define complex tasks
const build = gulp.series(gulp.parallel(scripts, minifyHtml, compileSass));
const dev = gulp.series(build, watch);

// Export tasks
exports.sass = compileSass;
exports.minify = minifyHtml;
exports.js = scripts;
exports.default = dev;