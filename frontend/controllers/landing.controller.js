  'use strict';

  (() =>{
  angular
  .module('app')
  .controller('landing-controller', landing_controller)

  landing_controller.$inject = ['$scope', '$window', '$rootScope','$location', 'landing-service'];

  function landing_controller($scope, $window, $rootScope, $location, landing_service) {
    
    $scope.data = {
      email: '',
      password: ''
    }

    $scope.login = () => {
      landing_service
      .user_login($scope.data)
      .then(function(res) {

      }, function(err) {
        toastr.error(err.message);
        $scope.data = {
          username: '',
          password: ''
        };

      })
    }

  }

  })();
