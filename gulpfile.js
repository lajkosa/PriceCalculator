var gulp = require('gulp'),
    browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
  browserSync.init({
    notify: true,
    server: {
      baseDir: "./",
      index: "index.html"
    },
    files: [
        './index.html',
        './assets/css/**/*.css',
        './assets/js/**/*.js'
    ]
  });
});

gulp.task('watch', function() {
  gulp.start('browser-sync');
});
