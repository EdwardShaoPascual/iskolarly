/*
  MVC Service for Report Controller and Report View
  Author: Eddie Ron Adolph A. Vallejos and John Edward P. Pascual
*/

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

      const retrieve_record = function (data) {
        let deferred = $q.defer();
        $http({
          method: 'GET',
          params: data,
          xhrFields: {withCredentials: true},
          url: '/api/retrieve_record',
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

      const retrieve_user = function (data) {
        let deferred = $q.defer();
        $http({
          method: 'GET',
          params: data,
          xhrFields: {withCredentials: true},
          url: '/api/retrieve_user',
          headers: headers
        })
        .then(function(res) {
          deferred.resolve(res.data);
        }, function(err) {
          deferred.reject(err);
        })

        return deferred.promise;
      }

      const retrieve_quiz_items = function (data) {
        let deferred = $q.defer();
        $http({
          method: 'GET',
          params: data,
          xhrFields: {withCredentials: true},
          url: '/api/retrieve_quiz_items',
          headers: headers
        })
        .then(function(res) {
          deferred.resolve(res.data);
        }, function(err) {
          deferred.reject(err);
        })

        return deferred.promise;
      }

      const process_data = function (data) {
        let deferred = $q.defer();
        $http({
          method: 'POST',
          params: data,
          url: '/api/process_data',
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
      service.list_questionnaires  			   = list_questionnaires;
      service.retrieve_activity_logs 		   = retrieve_activity_logs;
      service.retrieve_record              = retrieve_record;
      service.retrieve_user   		         = retrieve_user;  
      service.retrieve_quiz_items   		   = retrieve_quiz_items;  
      service.process_data   		           = process_data;  

      return service;

    }
})();