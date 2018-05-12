'use strict';

(() => {
  angular
  .module('app')
  .controller('attempt-controller', attempt_controller);

  attempt_controller.$inject = ['$http', '$routeParams', '$rootScope', '$scope', '$window', 'AttemptService'];

  function attempt_controller($http, $routeParams, $rootScope, $scope, $window, AttemptService) {
    $rootScope.questionnaire_id = $routeParams.questionnaire_id;
    $scope.user = [];
    $scope.date_data = {};
    $rootScope.disable = "wait";

    $scope.attempt_view = () => {
      AttemptService
      .view_attempt($rootScope.questionnaire_id)
      .then(function(res) {
        $scope.user = res[0];
			}, function(err) {
        toastr.error(err.data.message, 'Error');
      })
    }

    $scope.get_time = () => {
      var url = "//geoip.nekudo.com/api/";
      $http
      .get(url)
      .then(function(response) {
        $scope.country = response.data.country.name
      })
      .then(function(response) {
        var url = "http://timezoneapi.io/api/address/?" + $scope.country;
        $http
        .get(url)
        .then(function(resp) {
          $scope.date = resp.data.data.addresses[0].datetime.date_time_ymd;
        })
        .then(function(resp) {
          $scope.date_data.datetime = $scope.date.split('+')[0];
          $scope.date_data.questionnaire_id = $rootScope.questionnaire_id;
          
          AttemptService
          .get_time($scope.date_data)
          .then(function(res) {
            if (res.length === 0) {
              $rootScope.disable = false;
            } else {
              $rootScope.disable = true;
            }
          }, function(err) {
            console.clear();
            window.location.href = '/#/error_404';
          })
        })
      });
    }

    $scope.quiz_page = () => {
      $scope.url = '/#/quiz/' + $rootScope.questionnaire_id;
      window.location = $scope.url;
    }
  }
})();