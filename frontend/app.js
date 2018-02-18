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
    .when('/courses', {
      templateUrl: 'views/course.html'
    })
    .when('/error_404', {
      templateUrl: 'views/error_404.html'
    })
    .when('/sample', {
      templateUrl: 'views/sample.html'
    })
    .when('/questionnaire', {
      templateUrl: 'views/questionnaire.html',
      controller: 'questionnaire-controller'
    })
    .when('/question/:questionnaire_id', {
      templateUrl: 'views/question.html',
      controller: 'question-controller'
    })
    .otherwise({
      redirectTo: '/error_404'
    });
})
