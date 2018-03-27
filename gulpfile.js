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
  gulp.src('sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer({ browsers: ['last 4 versions'] }))
  .pipe(gulp.dest('css'))
  .pipe(minify())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('css'))
  .pipe(reload({stream: true}));
});

gulp.task('webserver', function(){  // запуск live-сервера
  server.init({
    server: {
      baseDir: './'
    },
    notify: false
  });
});

// Сборка проекта

gulp.task('css', function() {
  gulp.src('sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer({ browsers: ['last 4 versions'] }))
  .pipe(gulp.dest('build/css'))
  .pipe(minify())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css'))
})

gulp.task('html', function() {
  gulp.src('*.html')
  .pipe(gulp.dest('build'));
})

gulp.task('img', function() {
  gulp.src('img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('build/img'));
})

gulp.task('fonts', function() {
  gulp.src('fonts/*')
  .pipe(gulp.dest('build/fonts'));
})

gulp.task('js', function() {
  gulp.src('js/main.js')
  .pipe(gulp.dest('build/js'));
})

gulp.task('clean', function() {
  del('build');
})

gulp.task ('build', function(callback) { // запуск всех задач сборки 
  runsequence('clean', 'html', 'css', 'js', 'fonts', 'img', callback)
})

gulp.task ('watch', ['webserver', 'styles'], function() { // отслеживание изменения в файлах и перезагрузка
  gulp.watch('sass/**/*.scss', ['styles']);
  gulp.watch('*.html', server.reload);
  gulp.watch('js/*.js', server.reload);
});
