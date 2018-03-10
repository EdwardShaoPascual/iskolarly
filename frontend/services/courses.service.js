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

    let service = {};
    service.view_courses = view_courses;
    return service;
  }

})();