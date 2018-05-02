'use strict';
 
(() =>{
	angular
		.module('app')
		.controller('nav-controller',NavCtrl);

		function NavCtrl($scope, $window, $rootScope, $location, $interval) {
      
      $scope.home = true;
      $scope.courses = false;

      $scope.checkURL = () => {
        if ($location.path() == "/home") {
          $scope.home = true;
          $scope.courses = false;
        } else if ($location.path() == "/courses") {
          $scope.home = false;
          $scope.courses = true;
        }
        if ($location.path() == "/")
          return false;
        else return true;
      }

		}
})();