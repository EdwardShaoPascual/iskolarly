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

		}
})();