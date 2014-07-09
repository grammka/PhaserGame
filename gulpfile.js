var events  = require('events'),

	gulp    = require('gulp'),
	gutil   = require('gulp-util'),
	clean   = require('gulp-clean'),
	notify  = require('gulp-notify'),

	jade    = require('gulp-jade'),
	sass    = require('gulp-ruby-sass'),
	mincss  = require('gulp-minify-css'),

	concat  = require('gulp-concat'),
	uglify  = require('gulp-uglify'),
	rename  = require('gulp-rename'),

	minimg  = require('gulp-imagemin'),
	cache   = require('gulp-cache');


events.EventEmitter.defaultMaxListeners = 100;



var paths = {
	jade: {
		src: ['./assets/template/**/*.jade', '!./assets/template/**/_*.jade'],
		dest: './public'
	},
	scss: {
		src: ['./assets/scss/**/*.scss'],
		dest: './public/data/css'
	},
	jslib: {
		src: [
			'./assets/js/components/jquery/jquery.min.js',
			'./assets/js/libs/phaser.js',
			'./assets/js/libs/easystar.js',
			'./assets/js/libs/path-finder.js',
			'./assets/js/libs/tweenmax.js',
			'./assets/js/snippets/*.js'
		],
		dest: './public/data/js',
		concatName: 'lib.js'
	},
	js: {
		src: './assets/js/app/**/*.js',
		dest: './public/data/js',
		concatName: 'app.js'
	},
	json: {
		src: './assets/js/json/*.json',
		dest: './public/data/js'
	},
	img: {
		src: './assets/img/**/*',
		dest: './public/data/img'
	},
	fonts: {
		src: './assets/fonts/**/*',
		dest: './public/data/fonts'
	}
};



gulp.task('jade', function() {
	return gulp.src(paths.jade.src)
		.pipe(jade().on('error', gutil.log))
		.pipe(gulp.dest(paths.jade.dest))
		.pipe(notify({ message: 'gulp -- Jade' }));
});

gulp.task('scss', function() {
	return gulp.src(paths.scss.src)
		.pipe(sass({ compass: true, style: 'expanded' }))
		.pipe(gulp.dest(paths.scss.dest))
		.pipe(rename({ suffix: '.min' }))
		.pipe(mincss())
		.pipe(gulp.dest(paths.scss.dest))
		.pipe(notify({ message: 'gulp -- Scss' }));
});

function JSTask (path, name) {
	return gulp.src(path.src)
		.pipe(concat(path.concatName).on('error', gutil.log))
		.pipe(gulp.dest(path.dest).on('error', gutil.log))
		.pipe(uglify().on('error', gutil.log))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(path.dest))
		.pipe(notify({ message: 'gulp -- ' + name }));
}

gulp.task('jslib', function() {
	return JSTask(paths.jslib, 'JS Lib');
});

gulp.task('js', function() {
	return JSTask(paths.js, 'JS');
});

gulp.task('json', function() {
	return gulp.src(paths.json.src)
		.pipe(gulp.dest(paths.json.dest))
		.pipe(notify({ message: 'gulp -- JSON' }));
});

gulp.task('img', function() {
	return gulp.src(paths.img.src)
		.pipe(cache(minimg({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest(paths.img.dest))
		.pipe(notify({ message: 'gulp -- Images' }));
});

gulp.task('fonts', function() {
	return gulp.src(paths.fonts.src)
		.pipe(gulp.dest(paths.fonts.dest))
		.pipe(notify({ message: 'gulp -- Fonts' }));
});

gulp.task('clean', function() {
	return gulp.src(['./public/data/', './public/template'], { read: false })
		.pipe(clean())
		.pipe(notify({ message: 'gulp -- Clean' }));
});






gulp.task('i' /* init */, ['clean'], function() {
	gulp.start('jade', 'scss', 'jslib', 'js', 'json', 'img', 'fonts');
});

gulp.task('w' /* watch */, function() {

	gulp.watch('./assets/template/**/*.jade', ['jade']);
	gulp.watch('./assets/scss/**/*.scss', ['scss']);
	gulp.watch('./assets/js/**/*.js', ['js']);
	gulp.watch('./assets/js/json/*.json', ['json']);
	gulp.watch('./assets/img/**/*', ['img']);

});

