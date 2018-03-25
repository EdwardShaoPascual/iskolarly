'use strict';

(() => {
	angular
	.module('app')
	.controller('courses-controller', courses_controller);

  courses_controller.$inject = ['$scope', '$window', 'CoursesService'];

	function courses_controller($scope, $window, CoursesService) {
    
    $scope.courses = [];
    $scope.course_code = '';

    $scope.course_data = {
      course_title: '',
      course_description: ''
    }
    $scope.session = {};

    $scope.check_auth = () => {
      CoursesService
      .check_auth()
      .then(function(res) {
        $scope.session = res;
      }, function (err) {
        console.log(err);
      })
    }

    $scope.courses_view = () => {
      CoursesService
      .view_courses()
      .then(function(res) {
        $scope.courses = res;
      }, function(err) {
        toastr.error(err.data.message, 'Error');
      })
    }

    $scope.enroll_course = () => {
      $('#enrollModal').modal('hide');      
    }

    $scope.create_course = () => {
      if ($scope.course_data.course_title === '' ||
          $scope.course_data.course_description === '') {
        toastr.error("Please fill all the missing fields!", 'Error');                         
      } 
      else if ($scope.course_data.course_title.length < 5) {
        toastr.error("Course title must be in length of at least 5 characters!", 'Error');             
      } 
      else {
        CoursesService
        .create_course($scope.course_data)
        .then(function(res) {
          toastr.success('Creation of the class is successful!', 'Success');
          $scope.course_data = {
            course_title: '',
            course_description: ''
          }
          $('.modal').hide();
          $('.modal').modal('hide');          
        }, function(err) {
          toastr.error(err.data.message, 'Error');
        })
      }
    }
  }

})();