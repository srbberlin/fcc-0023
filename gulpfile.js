const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const browserSync = require('browser-sync')
const del = require('del')

var config = {
  cssin:    __dirname + '/src/css/**/*.css',
  jsin:     __dirname + '/src/babel/**/*.js',
  htmlin:   __dirname + '/src/html/**/*.html',
  assetsin: __dirname + '/src/assets/**/*',
  cssout:   __dirname + '/docs/css/',
  jsout:    __dirname + '/docs/js/',
  htmlout:  __dirname + '/docs/'
}

function clean () {
  return del([config.htmlout + '*'])
}

function reload () {
  browserSync.reload()
}

function html () {
  return gulp
    .src(config.htmlin)
    .pipe(gulp.dest(config.htmlout))
}

function assets () {
  return gulp
    .src(config.assetsin)
    .pipe(gulp.dest(config.htmlout))
}

function css () {
  return gulp
    .src(config.cssin)
    .pipe(gulp.dest(config.cssout))
}

function babl () {
  return gulp
    .src(config.jsin)
    .pipe(babel().on('error', e => {
      console.log('babel', e)
    }))
    .pipe(gulp.dest(config.jsout))
}

function serve () {
  browserSync({
    server: config.htmlout
  })

  gulp.watch(config.jsin, () => gulp.series(babl, reload))
  gulp.watch(config.cssin, () => gulp.series(css, reload))
  gulp.watch(config.htmlin, () => gulp.series(html, reload))
  gulp.watch(config.assetsin, () => gulp.series(assets, reload))
}

function build (cb) {
  gulp.series(clean, gulp.parallel(html, assets, babl, css))(cb)
}

exports.build = build
exports.clean = clean
exports.default = gulp.series(build, serve)