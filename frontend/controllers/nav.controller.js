'use strict';
 
(() =>{
	angular
		.module('app')
		.controller('nav-controller',NavCtrl);

		function NavCtrl($scope, $window, $rootScope, $location, $interval) {
      
      $scope.checkURL = () => {
        if ($location.path() == "/")
          return false;
        else return true;
      }
            
      // $scope.get_log = function(){
			// 	LogService
			// 	.get_log()
			// 	.then(function(res){
			// 		$scope.logs = res[0];
			// 	},function(err){
			// 		console.log(err);
			// 	})
			// }
		}
})();