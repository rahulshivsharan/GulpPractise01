var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var connect = require("connect");
var serve = require("serve-static");
var browsersync = require("browser-sync");

var browserify = require("browserify");
var source = require("vinyl-source-stream");
var inject = require("gulp-inject");

// copies jQuery js from 'node_modules'
// to dist folder 
gulp.task("jquery",function(){
	return gulp.src("node_modules/jquery/dist/*.min.js").pipe(gulp.dest("dist/node_modules/jquery/dist/"));					
});

// copies Bootstrap js and css from 'node_modules'
// to dist folder
gulp.task("bootstrap",function(){
	//console.log("bootstrap task");	
	var sources = ["node_modules/bootstrap/dist/**/*.min.css",
					"node_modules/bootstrap/dist/**/*.min.js"];
	return gulp.src(sources).pipe(gulp.dest("dist/node_modules/bootstrap/dist/"));					
});

gulp.task("angular",function(){
	//console.log("angular task");	
	var sources = ["node_modules/angular/*.min.js"];
	return gulp.src(sources).pipe(gulp.dest("dist/node_modules/angular/"));					
});

gulp.task("angular-route",function(){
	//console.log("angular-route task");	
	var sources = ["node_modules/angular-route/*.min.js"];
	return gulp.src(sources).pipe(gulp.dest("dist/node_modules/angular-route/"));					
});

gulp.task("allJS",function(){
	console.log("Cope all.js task");
	return gulp.src("js/all.js").pipe(gulp.dest("dist/js/"));					
});

gulp.task("allCSS",function(){
	return gulp.src("css/all.css").pipe(gulp.dest("dist/css/"));					
});

gulp.task("dependencies",[	"angular",
							"angular-route",
							"jquery","bootstrap",
							"allJS",
							"allCSS"]); // task depedencies is mapped to the dependent lib

// task to inject dependencies in primary html
gulp.task("primarySPA",function(){
	var target = gulp.src("app/primaryPages/*.html");
	var dependencies = ["node_modules/jquery/**/*.min.js",
						"node_modules/bootstrap/dist/**/*.min.css",
						"node_modules/bootstrap/dist/**/*.min.js",
						"node_modules/angular/angular.min.js",
						"node_modules/angular-route/angular-route.min.js",
						"js/all.js",
						"css/all.css"];
	var sources = gulp.src(dependencies,{read : false});

	return target.pipe(inject(sources)).pipe(gulp.dest("dist/primaryPages/"));
});

gulp.task("routePages",function(){
	var target = gulp.src("app/secondaryPages/*.html");
	return target.pipe(gulp.dest("dist/secondaryPages/"));
});

gulp.task("htmls",["primarySPA","routePages"]);

// to concat all css files
gulp.task("styles",function(){
	console.log("style task");
	return gulp.src("css/*.css").pipe(concat("all.css")).pipe(gulp.dest("css/"));
});

// to concat all js files
gulp.task("scripts",function(){
	console.log("scripts task");
	var sources = ["js/main.js","js/secondary.js"] 
	return gulp.src(sources).pipe(concat("all.js")).pipe(uglify()).pipe(gulp.dest("js/"));
});

// to browser sync 
gulp.task("watch",function(){
	console.log("watch task");
	gulp.watch("css/*.css",["styles","allCSS",browsersync.reload]);
	gulp.watch("js/*.js",["scripts","allJS",browsersync.reload]);
	gulp.watch("**/*.html",["htmls",browsersync.reload]);
});

// to start server
gulp.task("server",function(){
	console.log("server task");
	return 	connect().
			use(serve("dist")).
			listen(8023).
			on("listening",function(){
				console.log("Server running : view at \"http://127.0.0.1:8023\"");
			});
});

// to browser sync the changes
gulp.task("browsersync",function(cb){
	return browsersync({
		server : {
			baseDir : "./"
		}
	},cb);
});

gulp.task("browserify",function(){
	return 	browserify("app/js/*.js").
			bundle().
			pipe(source("bundle.js")).
			pipe(gulp.dest("dist"));
});

gulp.task("default",["styles","scripts","dependencies","htmls","watch","server"]);