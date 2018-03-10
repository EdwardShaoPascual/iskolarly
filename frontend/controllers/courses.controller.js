'use strict';

(() => {
	angular
	.module('app')
	.controller('courses-controller', courses_controller);

  courses_controller.$inject = ['$scope', '$window', 'CoursesService'];

	function courses_controller($scope, $window, CoursesService) {
    $scope.courses = [];

    $scope.courses_view = () => {
      CoursesService
      .view_courses()
      .then(function (res) {
        $scope.courses = res;
      }, function(err) {
        toastr.error(err.data.message, 'Error');
      })
    }
  }

})();