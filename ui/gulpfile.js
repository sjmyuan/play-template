"use strict";

const gulp = require('gulp');
const del = require('del');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const webpack = require('webpack-stream');
const babel = require('babel-register');
const hash = require('gulp-hash');
const merge = require("merge-stream");
const mirror = require("gulp-mirror");
const _ = require('lodash');
const path = require('path');
const sassLint = require('gulp-sass-lint');
const distDir = '../public';

gulp.task('clean:css', (done) => {
  return del([
    distDir+'/css/*'
  ], {force:true});
});

gulp.task('clean:img', (done) => {
  return del([
    distDir+'/img/*'
  ], {force:true});
});

gulp.task('clean:js', (done) => {
  return del([
    distDir+'/js/*'
  ], {force:true});
});

gulp.task('clean', ['clean:css', 'clean:js', 'clean:img']);

const webpackConfig = {
  entry: {
    main: './src/js/main.js',
    vendor: ['react', 'react-router', 'lodash', 'events', 'history', 'classnames']
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json'],
    modulesDirectories: [
      './node_modules',
      './node_modules/rui-advertorial/src/js',
      './node_modules/rui-browser-tools/src/js',
      './node_modules/spin.js/'
    ]
  }
};

function cssminRelease() {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass({includePaths: [require("bourbon").includePaths]}))
    .pipe(cleanCss({keepSpecialComments: 0}))
    .pipe(rename('css/main.css'));
}

function webpackRelease() {
  const plugins = [
    new webpack.webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify('production')
      }
    }),
    new webpack.webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity),
    new webpack.webpack.optimize.DedupePlugin(),
    new webpack.webpack.optimize.UglifyJsPlugin()
  ];

  return gulp.src('./src/js/main.js')
    .pipe(webpack(
      _.assign(webpackConfig, {
        plugins: plugins,
        output: {
          filename: 'main.js'
        }
      })
    ))
    .pipe(rename({dirname: 'js'}));
}

function copyImage() {
  return gulp.src('./src/img/**/*').pipe(rename(filePath => {
    filePath.dirname = 'img/' + filePath.dirname;
  }));
}

function dist() {
  const jsAndCss =
    merge(
      cssminRelease(),
      webpackRelease()
    ).pipe(hash())
    .pipe(mirror(
        hash.manifest('generated/assets.json'),
        rename(
          function (path) {
            path.dirname = path.dirname;
          }
        )
      ));
  return merge(jsAndCss, copyImage());
}

gulp.task('lint', () => {
  return gulp.src([
    '**/*.js',
    '!./node_modules/**',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// How to use a config file? https://github.com/sasstools/gulp-sass-lint/issues/34
gulp.task('sass-lint', function () {
  return gulp.src('./src/sass/**/*.s+(a|c)ss')
    .pipe(sassLint({
       configFile: '.sass-lint.yml'
     }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('dist',['clean', 'lint', 'sass-lint'], () => {
  return dist().pipe(gulp.dest(distDir));
});
