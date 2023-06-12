const {
  src, dest, parallel, series, watch,
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const svgmin = require('gulp-svgmin');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const tiny = require('gulp-tinypng-compress');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');
const stylelint = require('gulp-stylelint');

const clean = () => del(['app/*']);

const fonts = () => {
  src('./src/fonts/**.ttf')
    .pipe(ttf2woff())
    .pipe(dest('./app/fonts/'));
  return src('./src/fonts/**.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('./app/fonts/'));
};

const cb = () => {};

const srcFonts = './src/scss/common/_fonts.scss';
const appFonts = './app/fonts/';

const fontsStyle = (done) => {
  fs.writeFile(srcFonts, '', cb);
  fs.readdir(appFonts, (err, items) => {
    if (items) {
      let classFontname;
      for (let i = 0; i < items.length; i += 1) {
        let fontname = items[i].split('.');
        // eslint-disable-next-line prefer-destructuring
        fontname = fontname[0];
        if (classFontname !== fontname) {
          fs.appendFile(
            srcFonts,
            `@include font-face("${fontname}", "${fontname}", 400);\r\n`,
            cb,
          );
        }
        classFontname = fontname;
      }
    }
  });

  done();
};

const svgMin = () => src('./src/img/**.svg')
  .pipe(
    svgmin({
      js2svg: {
        pretty: true,
      },
    }),
  )
  .pipe(dest('./app/img'));

const scssLintFix = () => src('./src/scss/**/*.scss')
  .pipe(
    stylelint({
      fix: true,
    }),
  )
  .pipe(dest('src/scss/'));

const styles = () => src('./src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(
    sass({
      outputStyle: 'expanded',
    }).on('error', notify.onError()),
  )
  .pipe(rename({ suffix: '.min' }))
  .pipe(autoprefixer({ cascade: false }))
  .pipe(cleanCSS({ level: 2 }))
  .pipe(sourcemaps.write('.'))
  .pipe(dest('./app/css/'))
  .pipe(browserSync.stream());

const htmlInclude = () => src(['./src/index.html'])
  .pipe(
    fileInclude({
      prefix: '@',
      basepath: '@file',
    }),
  )
  .pipe(dest('./app'))
  .pipe(browserSync.stream());

const imgToApp = () => src(['./src/img/**.jpeg', './src/img/**.png', './src/img/**.jpeg']).pipe(
  dest('./app/img'),
);

const resources = () => src('./src/resources/**').pipe(dest('./app'));

const scripts = () => src('./src/js/main.js')
  .pipe(
    webpackStream({
      mode: 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          },
        ],
      },
    }),
  )
  .on('error', function (err) {
    console.error('WEBPACK ERROR', err);
    this.emit('end'); // Don't stop the rest of the task
  })

  .pipe(sourcemaps.init())
  .pipe(uglify().on('error', notify.onError()))
  .pipe(sourcemaps.write('.'))
  .pipe(dest('./app/js'))
  .pipe(browserSync.stream());

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: './app',
    },
  });
  watch('./src/scss/**/*.scss', styles);
  watch('./src/html/**/*.html', htmlInclude);
  watch('./src/index.html', htmlInclude);
  watch('./src/img/**.jpg', imgToApp);
  watch('./src/img/**.png', imgToApp);
  watch('./src/img/**.jpeg', imgToApp);
  watch('./src/img/**.svg', svgMin);
  watch('./src/resources/**', resources);
  watch('./src/fonts/**.ttf', fonts);
  watch('./src/fonts/**.ttf', fontsStyle);
  watch('./src/js/**/*.js', scripts);
};

exports.styles = styles;
exports.watchFiles = watchFiles;

exports.default = series(
  clean,
  parallel(htmlInclude, scripts, fonts, resources, imgToApp, svgMin),
  fontsStyle,
  styles,
  watchFiles,
);

const tinypng = () => src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
  .pipe(
    tiny({
      key: 'mGZNcvtQkM41DHM9hVpF19QFPnvPkLmh',
      log: true,
    }),
  )
  .pipe(dest('./app/img'));

const stylesBuild = () => src('./src/scss/**/*.scss')
  .pipe(
    sass({
      outputStyle: 'expanded',
    }).on('error', notify.onError()),
  )
  .pipe(
    rename({
      suffix: '.min',
    }),
  )
  .pipe(
    autoprefixer({
      cascade: false,
    }),
  )
  .pipe(
    cleanCSS({
      level: 2,
    }),
  )
  .pipe(dest('./app/css/'));

const scriptsBuild = () => src('./src/js/main.js')
  .pipe(
    webpackStream({
      mode: 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          },
        ],
      },
    }),
  )
  .on('error', function (err) {
    console.error('WEBPACK ERROR', err);
    this.emit('end'); // Don't stop the rest of the task
  })
  .pipe(uglify().on('error', notify.onError()))
  .pipe(dest('./app/js'));

exports.build = series(
  clean,
  parallel(htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgMin),
  fontsStyle,
  stylesBuild,
  tinypng,
);

// deploy
const deploy = () => {
  const conn = ftp.create({
    host: '',
    user: '',
    password: '',
    parallel: 10,
    log: gutil.log,
  });

  const globs = ['app/**'];

  return src(globs, {
    base: './app',
    buffer: false,
  })
    .pipe(conn.newer(''))
    .pipe(conn.dest(''));
};

exports.deploy = deploy;

exports.stylelint = parallel(scssLintFix);
