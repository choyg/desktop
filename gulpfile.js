const gulp = require('gulp');
const googleWebFonts = require('gulp-google-webfonts');
const del = require('del');
const fs = require('fs');

const paths = {
    cssDir: './src/css/',
    node_modules: './node_modules/',
    dist: './dist/',
    resources: './resources/',
};

function clean() {
    return del([paths.cssDir]);
}

function webfonts() {
    return gulp.src('./webfonts.list')
        .pipe(googleWebFonts({
            fontsDir: 'webfonts',
            cssFilename: 'webfonts.css',
            format: 'woff',
        }))
        .pipe(gulp.dest(paths.cssDir));
}

// ref: https://github.com/angular/angular/issues/22524
function cleanupAotIssue() {
    return del(['./node_modules/@types/uglify-js/node_modules/source-map/source-map.d.ts']);
}

// ref: https://github.com/t4t5/sweetalert/issues/890
function fixSweetAlert(cb) {
    fs.writeFileSync(paths.node_modules + 'sweetalert/typings/sweetalert.d.ts',
        'import swal, { SweetAlert } from "./core";export default swal;export as namespace swal;');
    cb();
}

exports.clean = clean;
exports.cleanupAotIssue = cleanupAotIssue;
exports.webfonts = gulp.series(clean, webfonts);
exports['prebuild:renderer'] = gulp.parallel(webfonts, cleanupAotIssue);
exports.fixSweetAlert = fixSweetAlert;
exports.postinstall = fixSweetAlert;
