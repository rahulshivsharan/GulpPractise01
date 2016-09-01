angular.module("myApp",["ngRoute"]);

angular.module("myApp").controller("myctrl",myctrl);
angular.module("myApp").config(config);
angular.module("myApp").factory("paramService",param);



myctrl.$inject = ["$scope","$location","paramService"];
config.$inject = ["$routeProvider"];

function param(){
	var map = {
		1 : "intro",
		2 : "churchil",
		3 : "lincoln",
		4 : "gandhi"
	}
	return {
		pageName : 0,
		getPage : function(){
			return map[this.pageName];
		}
	}
}

function myctrl($scope,$location,paramService){
	var vm = this;
	vm.init = init;
	vm.load = load;
	vm.pageNum = 0; 

	function init(param){
		//console.log("Controller initialised.... "+param);
		//paramService.pageName++;
		vm.pageNum = 1;
	}

	function load(){
		//console.log(" Load New Page "+paramService.pageName);
		if(paramService.pageName >= 4){
			paramService.pageName = 1;
		}else{
			paramService.pageName++;
		}
		var page = paramService.getPage();
		//console.log("page "+page);
		$location.url(page);
	}
}

function config($routeProvider){
	$routeProvider.when("/gandhi",{
		templateUrl : "/secondaryPages/gandhi.html"
	});

	$routeProvider.when("/churchil",{
		templateUrl : "/secondaryPages/churchil.html"
	});

	$routeProvider.when("/lincoln",{
		templateUrl : "/secondaryPages/lincoln.html"
	});

	$routeProvider.otherwise({
		templateUrl : "/secondaryPages/intro.html"
	});
}