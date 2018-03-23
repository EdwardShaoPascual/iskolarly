'use strict';

(() => {
	angular
	.module('app')
	.controller('courses-controller', courses_controller);

  courses_controller.$inject = ['$scope', '$window', 'CoursesService'];

	function courses_controller($scope, $window, CoursesService) {
    
    $scope.courses = [];
    $scope.course_code = '';
    $scope.session = {};

    $scope.check_auth = () => {
      CoursesService
      .check_auth()
      .then(function (res) {
        $scope.session = res;
      }, function (err) {
        console.log(err);
      })
    }

    $scope.courses_view = () => {
      CoursesService
      .view_courses()
      .then(function (res) {
        $scope.courses = res;
      }, function(err) {
        toastr.error(err.data.message, 'Error');
      })
    }

    $scope.enroll_course = () => {
      $('#enrollModal').modal('hide');      
    }
  }

})();