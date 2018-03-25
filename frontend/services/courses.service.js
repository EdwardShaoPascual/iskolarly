'use strict';

(() => {
  angular
    .module('app')
    .factory('CoursesService', CoursesService);

  CoursesService.$inject = ['$http', '$q', '$window'];

  const headers = {
    'content-type': 'application/x-www-form-urlencoded'
  };

  function CoursesService($http, $q, $window) {

    function view_courses() {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/view_courses'
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    function enroll_course(data) {
      let deferred = $q.defer();

      $http({
        method: 'POST',
        params: data,
        xhrFields: {withCredentials: true},
        url: '/api/enroll_course',
        headers: headers
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    function create_course(data) {
      let deferred = $q.defer();

      $http({
        method: 'POST',
        params: data,
        xhrFields: {withCredentials: true},
        url: '/api/create_course',
        headers: headers
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    function check_auth() {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/check_auth'
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    let service = {};
    service.view_courses = view_courses;
    service.create_course = create_course;
    service.enroll_course = enroll_course;
    service.check_auth = check_auth;
    return service;
  }

})();