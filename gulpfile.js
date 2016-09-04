//Starting Gulp Project
// npm init
// npm install gulp gulp-sass browser-sync gulp-useref gulp-uglify gulp-cssnano gulp-imagemin gulp-cache del run-sequence --save-dev


var gulp = require('gulp'), // npm install gulp --save-dev
    sass = require('gulp-sass'), // npm install gulp-sass --save-dev
    browserSync = require('browser-sync').create(), // npm install browser-sync --save-dev
    useref = require('gulp-useref'), // npm install gulp-useref --save-dev
    uglify = require('gulp-uglify'), // npm install gulp-uglify --save-dev
    cssnano = require('gulp-cssnano'), // npm install gulp-cssnano
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'), // npm install gulp-imagemin --save-dev
    cache = require('gulp-cache'), // npm install gulp-cache --save-dev
    del = require('del'), // npm install del --save-dev
    runSequence = require('run-sequence'); // npm install run-sequence --save-dev

// Gulp tasks

// Sass - Compiles Sass or SCSS files
gulp.task('sass', function () {
   return gulp.src('site/sass/**/*.sass')
      .pipe(sass())
      .pipe(gulp.dest('site/css'))
      .pipe(browserSync.reload({
         stream: true
   }))
});

// Browser Sync - Makes a local host to preview site changes
gulp.task('browserSync', function() {
   browserSync.init ({
      server: {
         baseDir: 'site'
      },
   })
});

// Useref - Concatenate CSS and JS files
gulp.task('useref', function() {
   return gulp.src('site/*.html')
      .pipe(useref())
      // Only minifies JS files
      .pipe(gulpIf('*.js', uglify()))
      // Only minfies CSS files
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('site/dist'))
});

// ImageMin - Minifies images
gulp.task('images', function() {
   return gulp.src('site/img/**/*.+(png|jpg|gif|svg)')
      // Caches images that run through imagemin
      .pipe(cache(imagemin({
         interlaced: true
   })))
      .pipe(gulp.dest('site/dist/img'))
});

// Fonts - Copies fonts to dist
gulp.task('fonts', function() {
   return gulp.src('site/fonts/**/*')
      .pipe(gulp.dest('site/dist/fonts'))
});

// Delete - Cleans up generated files
gulp.task('clean:dist', function() {
   return del.sync('site/dist');
});

// Run Sequence - Runs a sequence of tasks
gulp.task('build', function(callback) {
   runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'],
              callback
   )
});

// Run Sequence 2 - Runs sequence
gulp.task('default', function(callback) {
   runSequence(['sass', 'browserSync', 'watch'],
      callback
   )
});

//This lets Gulp watch and update any Sass files
gulp.task('watch', ['browserSync', 'sass'], function () {
   gulp.watch('site/sass/**/*.sass', ['sass']);
   gulp.watch('site/*.html', browserSync.reload);
   gulp.watch('site/js/**/*.js', browserSync.reload)
})
