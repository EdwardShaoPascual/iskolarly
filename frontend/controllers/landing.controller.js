  'use strict';

  (() =>{
  angular
  .module('app')
  .controller('landing-controller', landing_controller)

  landing_controller.$inject = ['$scope', '$window', '$rootScope','$location', 'landing-service'];

  function landing_controller($scope, $window, $rootScope, $location, landing_service) {
    
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
      course: '',
      birthday: '',
      college: '',
      role: 'Student'
    }

    $scope.changeRoleToStd = () => {
      $scope.registerData.role = 'Student'
    }

    $scope.changeRoleToIns = () => {
      $scope.registerData.role = 'Instructor'
    }

    $scope.login = () => {
      landing_service
      .user_login($scope.loginData)
      .then(function(res) {
        console.log(res);
        toastr.success("Your signing in is successful!", "Success")
      }, function(err) {
        $scope.loginData = {
          username: '',
          password: ''
        }
        toastr.error(err.data.message, 'Error');
      })
    }

    $scope.register = () => {
      $scope.registerData.username = $scope.registerData.username.replace(" ", "");
      let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if ($scope.registerData.firstname === "" || 
          $scope.registerData.middlename === "" ||
          $scope.registerData.lastname === "" ||
          $scope.registerData.email === "" || 
          $scope.registerData.username === "" ||
          $scope.registerData.password === "" ||
          $scope.registerData.course === "" ||
          $scope.registerData.birthday === "" ||
          $scope.registerData.college === "" ||
          $scope.registerData.role === "") {
        toastr.error("Please fill all the missing fields!", 'Error');                         
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
        landing_service
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
            college: ''
          }
        }, function(err) {
          toastr.error(err.data.message, 'Error');
        })
      }
    }

  }

  })();
