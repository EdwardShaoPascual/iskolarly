'use strict';

(() => {
  angular
    .module('app')
    .factory('QuizService', QuizService);

  QuizService.$inject = ['$http', '$q'];

  const headers = {
    'content-type': 'application/x-www-form-urlencoded'
  };

  function QuizService($http, $q) {

    function view_questionnaires() {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/quiz'
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    let service = {};
    service.view_questionnaires = view_questionnaires;
    return service;
  }

})();