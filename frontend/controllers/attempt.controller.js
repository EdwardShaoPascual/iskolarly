'use strict';

(() => {
  angular
  .module('app')
  .controller('attempt-controller', attempt_controller);

  attempt_controller.$inject = ['$http', '$routeParams', '$rootScope', '$scope', '$window', 'AttemptService'];

  function attempt_controller($http, $routeParams, $rootScope, $scope, $window, AttemptService) {
    $rootScope.questionnaire_id = $routeParams.questionnaire_id;
    $scope.user = [];

    $scope.attempt_view = () => {
      AttemptService
      .view_attempt($rootScope.questionnaire_id)
      .then(function(res) {
        $scope.user = res[0];
			}, function(err) {
      })
    }

    $scope.quiz_page = () => {
      $scope.url = '/#/quiz/' + $rootScope.questionnaire_id;
      window.location = $scope.url;
    }
  }
})();