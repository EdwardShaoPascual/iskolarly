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
        url: '/api/view_quiz'
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
        url: '/api/add_quiz',
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

    const get_info_questionnaires = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/get_info_quiz/' + data
      })
      .then(function(res) {
        // $window.location.href = '/#/quiz';
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
        url: '/api/edit_quiz',
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

    const delete_questionnaires = function (data) {
      let deferred = $q.defer();

      console.log(data);
      
      $http({
        method: 'POST',
        params: data,
        url: '/api/delete_quiz/' + data,
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
    service.get_info_questionnaires = get_info_questionnaires;
    service.edit_questionnaires = edit_questionnaires;
    service.delete_questionnaires = delete_questionnaires;
    return service;
  }

})();