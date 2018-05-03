'use strict';
 
(() =>{
	angular
		.module('app')
		.controller('report-controller',report_controller);

    report_controller.$inject = ['$scope', '$window', '$interval'];    

		function report_controller($scope, $window, $interval) {

      $scope.display = '';

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

      $scope.rerender = () => {
        $(document).ready(function() {
          $('.js-example-basic-single').select2();
        });
      }

		}
})();
