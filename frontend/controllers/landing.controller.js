  'use strict';

  (() =>{
  angular
  .module('app')
  .controller('landing-controller', landing_controller)

  landing_controller.$inject = ['$scope', '$window', '$rootScope','$location', '$http', 'LandingService'];

  function landing_controller($scope, $window, $rootScope, $location, $http, LandingService) {
    
    $scope.roleFlag = 0;
    $scope.unloaded = true;

    $scope.roleRadio = {
      std: true,
      ins: false
    }
    
    $scope.loginData = {
      username: '',
      password: ''
    }

    $scope.registerData = {
      firstname: '', 
      middlename: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      repassword: '',
      course: '',
      birthday: '',
      college: '',
      role: 'Student'
    }

    $scope.changeRoleToStd = () => {
      $scope.registerData.role = 'Student';
      $scope.registerData.course = '';
      $scope.registerData.college = '-----------';
      $scope.roleFlag = 0;
      $scope.roleRadio = {
        std: true,
        ins: false
      }
    }

    $scope.changeRoleToIns = () => {
      $scope.registerData.role = 'Instructor';
      $scope.registerData.course = 'N/A';
      $scope.registerData.college = 'N/A';
      $scope.roleFlag = 1;
      $scope.roleRadio = {
        std: false,
        ins: true
      }
    }

    $scope.login = () => {
      var url = "//geoip.nekudo.com/api/";
      $http
      .get(url)
      .then(function(response) {
        $scope.loginData.ip = response.data.ip;
      })
      .then(function(response) {
        $('#loginModal').modal('hide');
        $('.modal').modal('hide');
        LandingService
        .user_login($scope.loginData)
        .then(function(res) {
          $('#loginModal').modal('hide');
          $('.modal').modal('hide');
          toastr.success("Your signing in is successful!", "Success");
          $scope.loginData = {
            username: '',
            password: ''
          }
          $window.location.href = '#/home';
        }, function(err) {
          $scope.loginData = {
            username: '',
            password: ''
          }
          toastr.error(err.data.message, 'Error');
        })
      })
    }

    $scope.register = () => {
      if ($scope.registerData.role == 'Instructor') {
        $scope.registerData.course = "N/A";
        $scope.registerData.college = "N/A";
      }
      $scope.registerData.username = $scope.registerData.username.replace(" ", "");
      let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if ($scope.registerData.firstname === "" || 
          $scope.registerData.middlename === "" ||
          $scope.registerData.lastname === "" ||
          $scope.registerData.email === "" || 
          $scope.registerData.username === "" ||
          $scope.registerData.password === "" ||
          $scope.registerData.repassword === "" ||
          $scope.registerData.course === "" ||
          $scope.registerData.birthday === "" ||
          $scope.registerData.college === "" ||
          $scope.registerData.role === "") {
        toastr.error("Please fill all the missing fields!", 'Error');                         
      } 
      else if ($scope.registerData.password !== $scope.registerData.repassword) {
        toastr.error("Password does not match! Please re-type your password again.", 'Error');                         
      }
      else if (pattern.test($scope.registerData.email) === false) {
        toastr.error("Invalid input of email address!", 'Error');             
      }
      else if ($scope.registerData.username.length < 6) {
        toastr.error("Username must be in length of at least 6 characters!", 'Error');     
      } 
      else if ($scope.registerData.password.length < 8) {
        toastr.error("Password must be in length of at least 8 characters!", 'Error');     
      } 
      else {
        var url = "//geoip.nekudo.com/api/";
        $http
        .get(url)
        .then(function(response) {
          $scope.registerData.ip = response.data.ip;
        })
        .then(function(response) {
          LandingService
          .sign_up($scope.registerData)
          .then(function(res) {
            $('.modal').modal('hide');          
            toastr.success('Your signing up is successful!', 'Success')
            $scope.registerData = {
              firstname: '',
              middlename: '',
              lastname: '',
              email: '',
              username: '',
              password: '',
              course: '',
              birthday: '',
              college: '',
              role: 'Student'
            }
            $scope.roleRadio = {
              std: true,
              ins: false
            }
          }, function(err) {
            toastr.error(err.data.message, 'Error');
          })
        })
      }
    }

  }

  })();
