'use strict';

(() => {
	angular
	.module('app')
	.controller('courses-controller', courses_controller);

  courses_controller.$inject = ['$scope', '$rootScope', '$route', '$routeParams', '$window', '$location', '$timeout', 'CoursesService'];

	function courses_controller($scope, $rootScope, $route, $routeParams, $window, $location, $timeout, CoursesService) {
    
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
    $rootScope.user_id;

    $scope.inst = {}

    $scope.check_auth = () => {
      $('.modal').hide();
      $('.modal').modal('hide');
      CoursesService
      .check_auth()
      .then(function(res) {
        $scope.session = res;
        $rootScope.session = res;
        $rootScope.user_id = $scope.session.user_id;

        if ($location.path().includes('/course/')) {
          $scope.check_course();
        }

        if ($location.path().includes('/question')) {
          $scope.check_inst();
        }

        if ($location.path().includes('/quiz')) {
          if ($scope.session.role === 'Student') {
            $scope.check_quiz();
          } else {
            window.location.href = '/#/error_404';
          }
        }

        if ($location.path().includes('/attempt')) {
          if ($scope.session.role === 'Student') {
            $scope.check_attempt();
          } else {
            window.location.href = '/#/error_404';
          }
        }

        if ($location.path() === '/') {
          window.location.href = '/#/home';
        }

        if ($scope.session.role === 'Student' && $location.path().includes('/question')) {
          window.location.href = '/#/error_404';
        }

        if ($location.path() === '/report' && $rootScope.session.role === 'Student') {
          swal({
            title: "Unauthorized Access",
            text: "This page is meant for instructors only",
            type: "error"
          }, () => {
            window.location.href = '/#/home';
          });
        }
        console.clear();        
      }, function (err) {
        if ($location.path() !== '/') {
          toastr.error(err.message + "!", "Error");
        }
        console.clear();        
        window.location.href = '/#/'
      })
    }

    $scope.check_role = () => {
      if ($rootScope.session === undefined) {
        console.clear();        
        return false;
      } else if ($rootScope.session.role === 'Student') {
        return false;
      } else if ($rootScope.session.role === 'Instructor') {
        return true;          
      }
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
            owl.trigger('owl.play',1500); //owl.play event accept autoPlay speed as second parameter
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
          $timeout(() => {
            let datum = $scope.course_data;
            datum.firstname = res[0].firstname;
            datum.lastname = res[0].lastname;
            datum.course_code = res[0].course_code;
            datum.course_id = res[0].course_id;
            datum.course_description = res[0].course_description;
            datum.course_section = res[0].course_section;
            datum.course_title = res[0].course_title;
            console.log(datum);
            $scope.courses.unshift(datum);
            $scope.$apply();
            $scope.course_data = {
              course_title: '',
              course_section: '',
              course_description: ''
            }
            $scope.course_code = {
              code: ''
            }
          }, 100);
          $('.modal').hide();
          $('.modal').modal('hide');
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

    $scope.check_inst = () => {
      $scope.inst.user_id = $scope.session.user_id;
      $scope.inst.questionnaire_id = $routeParams.questionnaire_id;
      CoursesService
      .check_inst($scope.inst)
      .then(function(res) {
        if (res.length === 0) {
          window.location.href = '/#/error_404';      
        }
      }, function(err) {
          window.location.href = '/#/error_404';
      })
    }

    $scope.check_course = () => {
      CoursesService
      .check_course($routeParams.course_id)
      .then(function(res) {
        if (res.length === 0) {
          window.location.href = '/#/error_404';          
        }
      }, function(err) {
        window.location.href = '/#/error_404';
      })
    }

    $scope.check_quiz = () => {
      CoursesService
      .check_quiz($routeParams.questionnaire_id)
      .then(function(res) {
        if (res.length === 0) {
          window.location.href = '/#/error_404';
        } else if ((res[0].attempts - res[0].attempted_ans) === 0) {
          $scope.url = '/#/attempt/' + $routeParams.questionnaire_id; 
          window.location.href = $scope.url;      
        }
      }, function(err) {
        window.location.href = '/#/error_404';
      })
    }

    $scope.check_attempt = () => {
      CoursesService
      .check_attempt($routeParams.questionnaire_id)
      .then(function(res) {
        if (res.length === 0) {
          $route.reload();
        }
      }, function(err) {
          window.location.href = '/#/error_404';
      })
    }
  }

})();