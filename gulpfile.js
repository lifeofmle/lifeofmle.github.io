var gulp 		= require('gulp'),
    sass 		= require('gulp-sass'),
    htmlmin 	= require('gulp-htmlmin'),
    concat 		= require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    reload 		= browserSync.reload;

var htmlMinifyRules = {
	removeComments: true,
	collapseWhitespace: true,
	conservativeCollapse: true
}

// Preprocess SCSS into CSS
gulp.task('sass', function() {
    return gulp
	    .src('./source/scss/**/*.scss')
	    .pipe(sass())
	    .pipe(concat('main.css'))
	    .pipe(gulp.dest('./assets/css'));
});

gulp.task('js', function() {
	return gulp
		.src('./source/js/main.js')
		.pipe(gulp.dest('./assets/js'));
});

// Minify files
gulp.task('minify', function() {
    return gulp
	    .src('./source/*.html')
	    .pipe(htmlmin(htmlMinifyRules))
	    .pipe(gulp.dest('./'));
});

// Move images
gulp.task('move', function() {
    return gulp
	    .src('./source/images/**/*')
	    .pipe(gulp.dest('./assets/images'));
});

gulp.task('sass-watch', ['sass'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            server: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("source/scss/*.scss", ['sass']).on("change", reload);
});


// Entry point to start Gulp
gulp.task('default', ['js','minify','move','sass-watch']);