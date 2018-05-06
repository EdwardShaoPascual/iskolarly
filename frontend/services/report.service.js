'use strict';

(() => {
  angular
    .module('app')
    .factory('ReportService', ReportService);

    ReportService.$inject = ['$window', '$http', '$q'];

    const headers = {
      'content-type': 'application/x-www-form-urlencoded'
    };

    function ReportService($window, $http, $q) {
    
      const list_questionnaires = function (data) {
        let deferred = $q.defer();
        $http({
          method: 'GET',
          params: data,
          xhrFields: {withCredentials: true},
          url: '/api/list_questionnaires',
          headers: headers
        })
        .then(function(res) {
          deferred.resolve(res.data);
        }, function(err) {
          deferred.reject(err);
        })

        return deferred.promise;
      }

      const retrieve_activity_logs = function () {
        let deferred = $q.defer();
        $http({
          method: 'GET',
          xhrFields: {withCredentials: true},
          url: '/api/retrieve_activity_logs',
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
      service.list_questionnaires  			= list_questionnaires;
      service.retrieve_activity_logs 		= retrieve_activity_logs;
      return service;

    }
})();