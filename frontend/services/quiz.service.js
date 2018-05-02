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

    const get_quiz = function (id, data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        params: data,
        url: '/api/get_quiz/' + id
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const get_answers = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/get_answer/' + data
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const insert_quizlog = function(data) {
      let deferred = $q.defer();

      $http({
        method: 'POST',
        params: data,
        url: '/api/insert_quizlog'
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const insert_questionlog = function(data) {
      let deferred = $q.defer();

      $http({
        method: 'POST',
        params: data,
        url: '/api/insert_questionlog'
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const insert_score = function(data) {
      let deferred = $q.defer();

      $http({
        method: 'POST',
        params: data,
        url: '/api/insert_score'
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
    service.get_answers = get_answers;
    service.insert_quizlog = insert_quizlog;
    service.insert_questionlog = insert_questionlog;
    service.insert_score = insert_score;
    return service;
  }

})();