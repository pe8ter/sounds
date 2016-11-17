
'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const mergeStream = require('merge-stream');
const typescript = require('typescript');
const del = require('del');
const Builder = require('systemjs-builder');
const karma = require('karma');
const join = require('path').join;

// ---------------------------------------------------------------------------------------------------------------------
//  Settings
// ---------------------------------------------------------------------------------------------------------------------

const DEPLOY = 'deploy';
const DIST = 'dist';
let TARGET = 'dev';
const SRC = 'src';
const LIB = 'lib';
const ANGULAR = '@angular';
let MINIFY = false;
let LINTFAIL = false;
const LIBS = [
    { glob: 'node_modules/web-animations-js/web-animations.min.js' },
    { glob: 'node_modules/web-animations-js/web-animations.min.js.map' },
    { glob: 'node_modules/core-js/client/shim.min.js' },
    { glob: 'node_modules/core-js/client/shim.min.js.map' },
    { glob: 'node_modules/reflect-metadata/Reflect.js' },
    { glob: 'node_modules/reflect-metadata/Reflect.js.map' },
    { glob: 'node_modules/systemjs/dist/system.js' },
    { glob: 'node_modules/systemjs/dist/system.js.map' },
    { glob: 'node_modules/zone.js/dist/zone.min.js' },
    {
        glob: ['node_modules/@angular/**/*.umd.js', '!node_modules/@angular/**/*-testing.umd.js'],
        dest: ANGULAR,
        flatten: true,
    },
];
const ASSETS = [];

// ---------------------------------------------------------------------------------------------------------------------
//  Top-Level Tasks
// ---------------------------------------------------------------------------------------------------------------------

gulp.task('default', (done) => {
    runSequence('build', 'watch', done);
});

// ---------------------------------------------------------------------------------------------------------------------
//  Build Tasks
// ---------------------------------------------------------------------------------------------------------------------

gulp.task('build', (done) => {
    runSequence('clean.target', ['build.src'], done);
});

gulp.task('build.prod', (done) => {
    TARGET = 'prod';
    MINIFY = true;
    LINTFAIL = true;
    runSequence('build', done);
});

gulp.task('build.src', (done) => {
    runSequence(
        'clean.target',
        [
            'copy.assets',
            'copy.lib',
            'copy.html',
            'copy.css',
        ],
        'bundle.rxjs',
        'transpile',
        [
            'lint.ts',
            'lint.css',
        ],
        done
    );
});

gulp.task('watch', () => {
    gulp.watch(ASSETS, ['copy.assets']);
    gulp.watch(join(SRC, '**/*.css'), ['copy.css']);
    gulp.watch(join(SRC, '**/*.html'), ['copy.html']);
    gulp.watch(join(SRC, '**/*.ts'), ['transpile']);
});

// ---------------------------------------------------------------------------------------------------------------------
//  Clean Tasks
// ---------------------------------------------------------------------------------------------------------------------

gulp.task('clean.target', (done) => {
    cleanDir(join(DIST, TARGET), done);
});

// ---------------------------------------------------------------------------------------------------------------------
//  Transpile Tasks
// ---------------------------------------------------------------------------------------------------------------------

gulp.task('transpile', () => {
    return transpile({
        minify: MINIFY,
    });
});

// ---------------------------------------------------------------------------------------------------------------------
//  Lint Tasks
// ---------------------------------------------------------------------------------------------------------------------

gulp.task('lint', ['lint.css', 'lint.ts']);

gulp.task('lint.css', () => {
    return gulp.src(join(SRC, '**/*.css'))
        .pipe(plugins.csslint('csslint.json'))
        .pipe(plugins.csslint.formatter())
        .pipe(plugins.if(LINTFAIL, plugins.csslint.formatter('fail')));
});

gulp.task('lint.ts', () => {
    return lintTS(SRC);
});

function lintTS(dir) {
    return gulp.src(join(dir, '**/*.ts'))
        .pipe(plugins.tslint({ formatter: 'verbose' }))
        .pipe(plugins.tslint.report({ emitError: LINTFAIL }));
}

// ---------------------------------------------------------------------------------------------------------------------
//  Copy Tasks
// ---------------------------------------------------------------------------------------------------------------------

gulp.task('bundle.rxjs', (done) => {
    const builder = new Builder('./');
    builder.config({
        paths: { 'rxjs/*': 'node_modules/rxjs/*.js' },
        map: { 'rxjs': 'node_modules/rxjs' },
        packages: { 'rxjs': { main: 'Rx.js', defaultExtension: 'js' } },
    });
    builder.bundle('rxjs', join(DIST, TARGET, LIB, 'Rx.js'), {
        normalize: true,
        runtime: false,
        sourceMaps: true,
        sourceMapContents: true,
        minify: true,
        mangle: true,
    }).then(() => done());
});

gulp.task('copy.lib', () => {
    return mergeStream.apply(null, LIBS.map((lib) => {
        return gulp.src(lib.glob)
            .pipe(plugins.if(lib.flatten, plugins.rename((path) => path.dirname = '')))
            .pipe(gulp.dest(join(DIST, TARGET, LIB, lib.dest || '')));
    }));
});

gulp.task('copy.html', () => {
    return gulp.src(join(SRC, '**/*.html'))
        .pipe(plugins.newer(join(DIST, TARGET)))
        .pipe(plugins.if(MINIFY, plugins.htmlmin({
            collapseWhitespace: true,
            caseSensitive: true,
            removeComments: true,
            removeRedundantAttributes: true,
        })))
        .pipe(gulp.dest(join(DIST, TARGET)));
});

gulp.task('copy.css', () => {
    return gulp.src(join(SRC, '**/*.css'))
        .pipe(plugins.newer(join(DIST, TARGET)))
        .pipe(plugins.if(MINIFY, plugins.cssnano()))
        .pipe(gulp.dest(join(DIST, TARGET)));
});

gulp.task('copy.assets', () => {
    return gulp.src(ASSETS)
        .pipe(plugins.newer(join(DIST, TARGET)))
        .pipe(gulp.dest(join(DIST, TARGET)));
});

// ---------------------------------------------------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------------------------------------------------

function isProd() {
    return TARGET === 'prod';
}

function cleanDir(dir, done) {
    del(dir).then(() => done());
}

const transpile = (() => {

    // Create TypeScript transpiler project BEFORE starting watch tasks.
    const transpilerProject = plugins.typescript.createProject('tsconfig.json', { typescript });

    return function _transpile(options) {

        options = options || {};

        return gulp.src(join(SRC, '**/*.ts'))
            .pipe(plugins.plumber())
            .pipe(transpilerProject())
            .js
            .pipe(plugins.if(options.minify, plugins.uglify()))
            .pipe(gulp.dest(join(DIST, TARGET)));
    };
})();

function pluginError(plugin, message, showStack) {
    return new plugins.util.PluginError({ plugin, message, showStack: !!showStack });
}
