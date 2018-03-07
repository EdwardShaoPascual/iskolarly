  'use strict';

  (() =>{
  angular
  .module('app')
  .controller('landing-controller', landing_controller)

  landing_controller.$inject = ['$scope', '$window', '$rootScope','$location', 'landing-service'];

  function landing_controller($scope, $window, $rootScope, $location, landing_service) {
    
    $scope.loginData = {
      email: '',
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
      college: ''
    }

    $scope.login = () => {
      landing_service
      .user_login($scope.loginData)
      .then(function(res) {
        console.log(res);
        toastr.success("Your signing in is successful!", "Success")
      }, function(err) {
        $scope.loginData = {
          email: '',
          password: ''
        }
        toastr.error(err.data.message, 'Error');
      })
    }

    $scope.register = () => {

      if ($scope.registerData.username.length < 6) {
        toastr.error("Username must be in length of at least 6 characters", 'Error');        
      } else {
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
