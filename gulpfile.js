/*
  Author - Pozharov Roman
  email - ru.roman.ps@gmail.com
*/


'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    server = require('browser-sync'),
    reload = server.reload,
    sass = require('gulp-sass'),
    minify = require('gulp-csso'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    runsequence = require('run-sequence'); // плагин для последовательного выполнения задач


gulp.task('styles', function() { // стили, префиксер, минификация
  gulp.src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer({ browsers: ['last 4 versions'] }))
  .pipe(gulp.dest('source/css'))
  .pipe(minify())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('source/css'))
  .pipe(reload({stream: true}));
});

gulp.task('webserver', function(){  // запуск live-сервера
  server.init({
    server: {
      baseDir: 'source/'
    },
    notify: false
  });
});

// Сборка проекта

gulp.task('css', function() {
  gulp.src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer({ browsers: ['last 4 versions'] }))
  .pipe(gulp.dest('build/css'))
  .pipe(minify())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css'))
})

gulp.task('html', function() {
  gulp.src('source/*.html')
  .pipe(gulp.dest('build'));
})

gulp.task('img', function() {
  gulp.src('source/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('build/img'));
})

gulp.task('fonts', function() {
  gulp.src('source/fonts/*')
  .pipe(gulp.dest('build/fonts'));
})

gulp.task('js', function() {
  gulp.src('source/js/main.js')
  .pipe(gulp.dest('build/js'));
})

gulp.task('clean', function() {
  del('build');
})

gulp.task ('build', function(callback) { // запуск всех задач сборки
  runsequence('clean', 'html', 'css', 'js', 'fonts', 'img', callback)
})

gulp.task ('watch', ['webserver', 'styles'], function() { // отслеживание изменения в файлах и перезагрузка
  gulp.watch('source/sass/**/*.scss', ['styles']);
  gulp.watch('source/*.html', server.reload);
  gulp.watch('source/js/*.js', server.reload);
});
