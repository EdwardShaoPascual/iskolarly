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
      }, function(err) {
        console.log(err);
      })
    }

    $scope.register = () => {
      landing_service
      .sign_up($scope.registerData)
      .then(function(res) {
        console.log(res);
      }, function(err) {
        console.log(err);
      })
    }

  }

  })();
