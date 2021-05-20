const gulp = require('gulp');
const sass = require('gulp-dart-sass');

/* ----------------------------------------- */
/*  Compile SCSS
/* ----------------------------------------- */

const SCSS = ['scss/*.scss'];
function compileSCSS() {
  return gulp
    .src('scss/swade-community-sheet.scss')
    .pipe(sass())
    .pipe(gulp.dest('./'));
}
const css = gulp.series(compileSCSS);

/* ----------------------------------------- */
/*  Watch Updates
/* ----------------------------------------- */

function watchUpdates() {
  gulp.watch(SCSS, css);
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.default = gulp.series(gulp.parallel(css), watchUpdates);
exports.css = css;
