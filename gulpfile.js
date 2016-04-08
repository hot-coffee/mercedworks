var gulp = require('gulp'); 
var watchLess = require('gulp-watch-less');
var less = require('gulp-less');

gulp.task('less', function(){ 
	return gulp.src('./public/stylesheets/*.less')
	.pipe(watchLess('./public/stylesheets/*.less'))
	.pipe(less())
	.pipe(gulp.dest('./public/stylesheets'))
});

gulp.task('watch', function(){
	gulp.watch('./public/stylesheets/*.less', ['less']); //watches less files
});

gulp.task('build', ['less', 'watch']); //aggregate all tasks on build

gulp.task('default', ['build']); //gulp default upon build