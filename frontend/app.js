'use strict'

let mainApp = angular.module("app", ['ngRoute']);

mainApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/landing.html'
    })
    .when('/error_404', {
      templateUrl: 'views/error_404.html'
    })
    .otherwise({
      redirectTo: '/error_404'
    });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false  
    })
})
