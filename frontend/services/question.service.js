'use strict';

(() => {
  angular
    .module('app')
    .factory('QuestionService', QuestionService);
  
  QuestionService.$inject = ['$http', '$q', '$window'];

  const headers = {
    'content-type': 'application/x-www-form-urlencoded'
  };

  function QuestionService($http, $q, $window) {

    const view_questions = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/view_question/' + data
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const add_questions = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'POST',
        params: data,
        url: '/api/add_question',
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
    service.view_questions = view_questions;
    service.add_questions = add_questions;
    return service;
  }

})();