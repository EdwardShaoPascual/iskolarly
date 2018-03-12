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

    const get_quiz = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/get_quiz/' + data
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    let service = {};
    service.get_quiz = get_quiz;
    return service;
  }

})();