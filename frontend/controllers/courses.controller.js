'use strict';

(() => {
	angular
	.module('app')
	.controller('courses-controller', courses_controller);

  courses_controller.$inject = ['$scope', '$window', 'CoursesService'];

	function courses_controller($scope, $window, CoursesService) {
    
    $scope.courses = [];
    $scope.course_code = {
      code: ''
    };

    $scope.course_data = {
      course_title: '',
      course_description: ''
    }
    $scope.session = {};

    $scope.search_filter = '';

    $scope.check_auth = () => {
      CoursesService
      .check_auth()
      .then(function(res) {
        $scope.session = res;
      }, function (err) {
        console.log(err);
      })
    }

    $scope.reroute = (id) => {
      window.location.href = "/#/course/" + id;
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
      if ($scope.course_code.code === '') {
        toastr.error("Invalid course code!", 'Error');                         
      } 
      else {
        CoursesService
        .enroll_course($scope.course_code)
        .then(function(res) {
          toastr.success('Your enrollment is successful!', 'Success');
          $scope.course_code = ""
          $('.modal').hide();
          $('.modal').modal('hide');          
        }, function(err) {
          toastr.error(err.message, 'Error');
        })
      }
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