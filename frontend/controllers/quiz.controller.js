'use strict';

(() => {
  angular
  .module('app')
  .controller('quiz-controller', quiz_controller);

  quiz_controller.$inject = ['$routeParams', '$scope', '$window', 'QuizService'];

  function quiz_controller($routeParams, $scope, $window, QuizService) {
    let count = 0;
    $scope.size = 0;
    let numArray = [];

    $scope.user = [];

    $scope.quiz_get = () => {
			QuizService
			.get_quiz($routeParams.questionnaire_id)
			.then(function(res) {
        $scope.user = res;
        $scope.size = $scope.user.length
        
        for (let i=0; i<$scope.size; i++) {
          let math = Math.floor(Math.random() * $scope.size);

          if (jQuery.inArray(math, numArray) == -1) { 
            numArray[count++] = math;
          } else {
            i--;
          }
        }

        count = 0;
        $scope.quiz = $scope.user[numArray[count]].question_desc;
        $scope.question_no = count + 1;
        $scope.answer = [];
        
        $scope.question_id = $scope.user[numArray[count]].question_id;
        QuizService
        .get_answers($scope.question_id)
        .then(function(rest) {
          $scope.answer = rest;
        }, function(errt) {
          console.log(errt);
        })
        
      }, function(err) {
				console.log(err);
			})
    }
    
    $scope.quiz_next = () => {
      if (count < $scope.size-1) {
        $scope.answer = [];

        $scope.quiz = $scope.user[numArray[++count]].question_desc;
        
        $scope.question_id = $scope.user[numArray[count]].question_id;
        QuizService
        .get_answers($scope.question_id)
        .then(function(res) {
          $scope.answer = res;
        }, function(err) {
          console.log(err);
        })

        $scope.question_no = count + 1;        

      }
    }

    $scope.quiz_prev = () => {
      if (count > 0) {
        $scope.answer = [];

        $scope.quiz = $scope.user[numArray[--count]].question_desc;
        
        $scope.question_id = $scope.user[numArray[count]].question_id;
        QuizService
        .get_answers($scope.question_id)
        .then(function(res) {
          $scope.answer = res;
        }, function(err) {
          console.log(err);
        })

        $scope.question_no = count + 1;
        
      }
    }
  }
  
})();