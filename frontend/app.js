'use strict'

let mainApp = angular.module("app", ['ngRoute']);

mainApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    .when('/', {
      templateUrl: 'views/landing.html'
    })
    .when('/home', {
      templateUrl: 'views/home.html',
    })
    .when('/courses', {
      templateUrl: 'views/courses.html'
    })
    .when('/course/:course_id', {
      templateUrl: 'views/course.html',
      controller: 'course-controller'
    })
    .when('/quiz/:questionnaire_id', {
      templateUrl: 'views/quiz.html',
      controller: 'quiz-controller'
    })
    .when('/question/:questionnaire_id', {
      templateUrl: 'views/question.html',
      controller: 'question-controller'
    })
    .when('/error_404', {
      templateUrl: 'views/error_404.html'
    })
    .otherwise({
      redirectTo: '/error_404'
    });
})
