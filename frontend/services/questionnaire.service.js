'use strict';

(() => {
  angular
    .module('app')
    .factory('QuestionnaireService', QuestionnaireService);

  QuestionnaireService.$inject = ['$http', '$q', '$window'];

  const headers = {
    'content-type': 'application/x-www-form-urlencoded'
  };

  function QuestionnaireService($http, $q, $window) {

    function view_questionnaires() {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/view_questionnaire'
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

      $http({
        method: 'POST',
        params: data,
        url: '/api/add_questionnaire',
        headers: headers
      })
      .then(function(res) {
        // $window.location.href = '/#/questionnaire';
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    const get_info_questionnaires = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/get_info_questionnaire/' + data
      })
      .then(function(res) {
        // $window.location.href = '/#/questionnaire';
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    const edit_questionnaires = function (data) {
      let deferred = $q.defer();
      
      $http({
        method: 'POST',
        params: data,
        url: '/api/edit_questionnaire',
        headers: headers
      })
      .then(function(res) {
        // $window.location.href = '/#/questionnaire';
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    const delete_questionnaires = function (data) {
      let deferred = $q.defer();
      
      $http({
        method: 'POST',
        params: data,
        url: '/api/delete_questionnaire/' + data,
        headers: headers
      })
      .then(function(res) {
        // $window.location.href = '/#/questionnaire';
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    let service = {};
    service.view_questionnaires = view_questionnaires;
    service.add_questionnaires = add_questionnaires;
    service.get_info_questionnaires = get_info_questionnaires;
    service.edit_questionnaires = edit_questionnaires;
    service.delete_questionnaires = delete_questionnaires;
    return service;
  }

})();