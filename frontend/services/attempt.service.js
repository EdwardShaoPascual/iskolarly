/*
  MVC Service for Attempt Controller and Attempt View
  Author: Eddie Ron Adolph A. Vallejos and John Edward P. Pascual
*/

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
        url: '/api/view_attempt/' + data
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const get_time = function(data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        params: data,
        url: '/api/get_time',
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
    service.get_time = get_time;
    return service;
  }

})();