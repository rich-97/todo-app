'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const webpack = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

gulp.task('scss', function () {
  gulp.src('./public/scss/main.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./public/dist/assets/css'));
});

gulp.task('webpack', function () {
  gulp.src('./public/dist/js/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./public/dist/assets/js'));
});

gulp.task('min-svg', function () {
  gulp.src('./public/svg/*.svg')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/dist/assets/svg'));
});

gulp.task('min-html', function () {
  gulp.src('./public/index.html')
    .pipe(htmlmin({ collapseWhispace: true }))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('default', ['scss', 'webpack', 'min-svg', 'min-html']);

gulp.task('watch', () => {
  gulp.watch(
    [
      './public/scss/*.scss',
      './public/js/main.js',
      './public/index.html'
    ],
    ['scss', 'webpack', 'min-html']);
});
