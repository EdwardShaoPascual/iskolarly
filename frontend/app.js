'use strict'

let mainApp = angular.module("app", ['ngRoute']);

mainApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    .when('/', {
      templateUrl: 'views/landing.html'
    })
    .when('/home', {
      templateUrl: 'views/home.html'
    })
    .when('/error_404', {
      templateUrl: 'views/error_404.html'
    })
    .otherwise({
      redirectTo: '/error_404'
    });
})
