/*
  MVC Service for Nav Controller and Nav View
  Author: Eddie Ron Adolph A. Vallejos and John Edward P. Pascual
*/

'use strict';

(() => {
  angular
    .module('app')
    .factory('NavService', NavService);

    NavService.$inject = ['$window', '$http', '$q'];

    const headers = {
      'content-type': 'application/x-www-form-urlencoded'
    };

    function NavService($window, $http, $q) {
    
      const user_logout = function (data) {
        let deferred = $q.defer();
        $http({
          method: 'POST',
          params: data,
          xhrFields: {withCredentials: true},
          url: '/api/logout',
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
      service.user_logout  			  = user_logout;
      return service;

    }
})();