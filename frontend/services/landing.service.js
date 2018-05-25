/*
  MVC Service for Landing Controller and Landing View
  Author: Eddie Ron Adolph A. Vallejos and John Edward P. Pascual
*/

'use strict';

(() => {
  angular
    .module('app')
    .factory('LandingService', LandingService);

    LandingService.$inject = ['$window', '$http', '$q'];

    const headers = {
      'content-type': 'application/x-www-form-urlencoded'
    };

    function LandingService($window, $http, $q) {
    
      const user_login = function (data) {
        let deferred = $q.defer();
        $http({
          method: 'POST',
          params: data,
          xhrFields: {withCredentials: true},
          url: '/api/login',
          headers: headers
        })
        .then(function(res) {
          deferred.resolve(res.data);
        }, function(err) {
          deferred.reject(err);
        })

        return deferred.promise;
      }

      const sign_up = function (data) {
        let deferred = $q.defer();
        $http({
          method: 'POST',
          params: data,
          xhrFields: {withCredentials: true},
          url: '/api/register',
          headers: headers
        })
        .then(function(res) {
          deferred.resolve(res.data);
        }, function(err) {
          deferred.reject(err);
        })

        return deferred.promise;
      }
      
      let service = {};
      service.user_login 				= user_login;
      service.sign_up 				  = sign_up;
      return service;

    }
})();