'use strict';

(() => {
  angular
    .module('app')
    .factory('QuizService', QuizService);

  QuizService.$inject = ['$http', '$q', '$window'];

  const headers = {
    'content-type': 'application/x-www-form-urlencoded'
  };

  function QuizService($http, $q, $window) {

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

    const add_questionnaires = function (data) {
      let deferred = $q.defer();

      console.log(data);

      $http({
        method: 'POST',
        params: data,
        url: '/quiz',
        headers: headers
      })
      .then(function(res) {
        // $window.location.href = '/#/quiz';
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    let service = {};
    service.view_questionnaires = view_questionnaires;
    service.add_questionnaires = add_questionnaires;
    return service;
  }

})();