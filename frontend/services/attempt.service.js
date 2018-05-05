'use strict';

(() => {
  angular
    .module('app')
    .factory('AttemptService', AttemptService);

  AttemptService.$inject = ['$http', '$q', '$window'];

  const headers = {
    'content-type': 'application/x-www-form-urlencoded'
  };

  function AttemptService($http, $q, $window) {

    function view_attempt(data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/view_attempt/' + data,
        headers: headers
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    let service = {};
    service.view_attempt = view_attempt;
    return service;
  }

})();