require('dotenv-safe').load(); // load up environment variables

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const browserify = require('browserify');
const babelify = require('babelify');
const hbsfy = require('hbsfy');
const envify = require('envify');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const gulpNodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();


// run front end development server, do page reloads, etc
gulp.task('default', ['sass', 'jsDev', 'watch'], () => {

  // initialize nodemon server
  gulpNodemon({
      script: 'index.js',
      watch: ['index.js'],
      // env: { 'NODE_ENV': 'development' }
    })

    // initialize browsersync
    browserSync.init({
        proxy: 'localhost:8081',
        open: false,
        online: true,
    })
})

// bundle, compress, minify, etc files for production
gulp.task('build', ['sass', 'jsBuild'], () => {
  console.log('code is built for production...');
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () =>  {
  gulp.src('./scss/main-styles.scss')
           .pipe(sourcemaps.init())
           .pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
           .pipe(sourcemaps.write())
           .pipe(gulp.dest('./public/styles/css/'))
           .pipe(browserSync.stream());
})

gulp.task('watch', () => {
  gulp.watch(['./views/**/*.*' ], ['jsDev']);
  gulp.watch(['./entry.js', './routes/*.js', './firebase/*.js', './api/*.js'], ['jsDev']);
  gulp.watch([ './scss/**/*.scss'], ['sass'])
console.log('gulp is up...');
})

// Bundle javascript
gulp.task('jsDev', () => {
  jsBundle(false);
})
gulp.task('jsBuild', () => {
  jsBundle(true, 'production');
})

function jsBundle(flag, env){
  process.env.NODE_ENV = env || 'development';
  // todo: tweak minification settings according to env
  let minify = flag;
  browserify('./entry.js', {
    debug: true,
    transform: ['babelify',['hbsfy', {extensions: 'html'}], ['envify']]
  })
  .bundle()
  .on("error", function (err) { console.log("Error: " + err); })
  .pipe(source('bundle.js'))
  .pipe(gulpif(minify, streamify(uglify())))
  .pipe(gulp.dest('./public/js/'))
  .pipe(browserSync.stream());
}
