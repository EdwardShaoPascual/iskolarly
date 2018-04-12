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

    const get_questions = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/get_question/' + data
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const check_questions = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'POST',
        params: data,
        url: '/api/check_question',
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

    const delete_questions = function (data) {
      let deferred = $q.defer();
      
      $http({
        method: 'POST',
        params: data,
        url: '/api/delete_question/' + data,
        headers: headers
      })
      .then(function(res) {
        // $window.location.href = '/#/question';
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    const get_info_questions = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/get_info_question/' + data
      })
      .then(function(res) {
        // $window.location.href = '/#/question';
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    const view_answers = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/view_answer/' + data
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const add_answers = function (data1, data2) {
      let deferred = $q.defer();
      
      $http({
        method: 'POST',
        params: data1,
        url: '/api/add_answer/' + data2,
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

    const delete_answers = function (data) {
      let deferred = $q.defer();
      
      $http({
        method: 'POST',
        params: data,
        url: '/api/delete_answer/' + data,
        headers: headers
      })
      .then(function(res) {
        // $window.location.href = '/#/answer';
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    let service = {};
    service.view_questions = view_questions;
    service.get_questions = get_questions;
    service.check_questions = check_questions;
    service.add_questions = add_questions;
    service.delete_questions = delete_questions;

    service.get_info_questions = get_info_questions;
    service.view_answers = view_answers;
    service.add_answers = add_answers;
    service.delete_answers = delete_answers;
    return service;
  }

})();