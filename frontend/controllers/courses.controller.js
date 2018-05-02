'use strict';

(() => {
	angular
	.module('app')
	.controller('courses-controller', courses_controller);

  courses_controller.$inject = ['$scope', '$window', '$location', '$timeout', 'CoursesService'];

	function courses_controller($scope, $window, $location, $timeout, CoursesService) {
    
    $scope.courses = [];
    $scope.course_code = {
      code: ''
    };

    $scope.course_data = {
      course_title: '',
      course_section: '',
      course_description: ''
    }
    $scope.session = {};

    $scope.search_filter = '';

    $scope.check_auth = () => {
      CoursesService
      .check_auth()
      .then(function(res) {
        $scope.session = res;
        if ($location.path() === '/') {
          window.location.href = '/#/home';
        }
      }, function (err) {
        window.location.href = '/#/'
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
      .then(function(res) {
        $(document).ready(function() {
  
          var owl = $("#owl-demo");
         
          owl.owlCarousel({
              items : 4,
             //  itemsDesktop : [1000,3],
              itemsDesktopSmall : [900,2], 
              itemsTablet: [600,1],
              itemsMobile : false 
          });
         
          $(".next").click(function(){
            owl.trigger('owl.next');
          })
          $(".prev").click(function(){
            owl.trigger('owl.prev');
          })
          $(".play").click(function(){
            owl.trigger('owl.play',1000); //owl.play event accept autoPlay speed as second parameter
          })
          $(".stop").click(function(){
            owl.trigger('owl.stop');
          })
         
       });
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
          $('.modal').hide();
          $('.modal').modal('hide');
          $scope.course_code = ""
        }, function(err) {
          toastr.error(err.message, 'Error');
        })
      }
    }

    $scope.create_course = (data) => {
      if ($scope.course_data.course_title === '' ||
          $scope.course_data.course_description === '') {
        toastr.error("Please fill all the missing fields!", 'Error');                         
      } 
      else if ($scope.course_data.course_title.length < 5) {
        toastr.error("Course title must be in length of at least 5 characters!", 'Error');             
      }
      else if ($scope.course_data.course_section.length === 0) {
        toastr.error("Course section must be in length of at least 1 character!", 'Error');             
      } 
      else if ($scope.course_data.course_description.length > 256) {
        toastr.error("Course description must be in length of at most 256 characters!", 'Error');             
      } 
      else {
        CoursesService
        .create_course($scope.course_data)
        .then(function(res) {
          toastr.success('Creation of the class is successful!', 'Success');
          $timeout(() => {
            let datum = $scope.course_data;
            datum.firstname = data.firstname;
            datum.lastname = data.lastname;
            datum.course_code = res[0].course_code;
            datum.course_id = res[0].course_id;
            $scope.courses.unshift(datum);
            $scope.$apply();
            $scope.course_data = {
              course_title: '',
              course_section: '',
              course_description: ''
            }
          }, 100);
          $('.modal').hide();
          $('.modal').modal('hide');          
        }, function(err) {
          toastr.error(err.data.message, 'Error');
        })
      }
    }
  }

})();