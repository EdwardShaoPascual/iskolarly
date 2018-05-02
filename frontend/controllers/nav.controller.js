'use strict';
 
(() =>{
	angular
		.module('app')
		.controller('nav-controller',nav_controller);

    nav_controller.$inject = ['$scope', '$window', '$rootScope','$location', '$interval', 'NavService'];    

		function nav_controller($scope, $window, $rootScope, $location, $interval, NavService) {
      
      $scope.home = true;
      $scope.courses = false;

      $scope.checkURL = () => {
        if ($location.path() == "/home") {
          $scope.home = true;
          $scope.courses = false;
        } else if ($location.path() == "/courses") {
          $scope.home = false;
          $scope.courses = true;
        } else if ($location.path() == "/report") {
          $scope.home = false;
          $scope.courses = false;
        } else {
          $scope.home = false;
          $scope.courses = true;
        }
        if ($location.path() == "/")
          return false;
        else return true;
      }

      $scope.user_logout = () => {
        NavService
        .user_logout()
        .then(function(res) {
          toastr.success(res.message, "Success");
          window.location.href = "/#/"
        }, function(err) {
          toastr.error(res.message, "Error");
        })
      }

		}
})();
