'use strict';

(() => {
  angular
    .module('app')
    .factory('CourseService', CourseService);

  CourseService.$inject = ['$http', '$q', '$window'];

  const headers = {
    'content-type': 'application/x-www-form-urlencoded'
  };

  function CourseService($http, $q, $window) {

    function retrieve_course(data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        params: data,
        url: '/api/retrieve_course',
        headers: headers
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    function retrieve_announcement(data) {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        params: data,
        url: '/api/retrieve_announcement',
        headers: headers
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const create_note = function (data) {
      let deferred = $q.defer();

      $http({
        method: 'POST',
        params: data,
        url: '/api/post_note',
        headers: headers
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    const stud_view_announcements = function () {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/stud_view_announcement'
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const inst_view_announcements = function () {
      let deferred = $q.defer();

      $http({
        method: 'GET',
        url: '/api/inst_view_announcement'
      })
      .then(function(res) {
        deferred.resolve(res.data);
      }, function(err) {
        deferred.reject(err.data);
      })

      return deferred.promise;
    }

    const view_questionnaires = function () {
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

    const upload_attachment = function (data) {

      let deferred = $q.defer();
      $http({
        method: 'POST',
        data: data,
        url: '/api/upload_attachment/',
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
    service.retrieve_course = retrieve_course;
    service.retrieve_announcement = retrieve_announcement;
    service.create_note = create_note;
    service.stud_view_announcements = stud_view_announcements;
    service.inst_view_announcements = inst_view_announcements;
    service.view_questionnaires = view_questionnaires;
    service.add_questionnaires = add_questionnaires;
    service.get_info_questionnaires = get_info_questionnaires;
    service.edit_questionnaires = edit_questionnaires;
    service.delete_questionnaires = delete_questionnaires;
    service.upload_attachment = upload_attachment;
    return service;
  }

})();