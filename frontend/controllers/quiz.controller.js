'use strict';

(() => {
  angular
  .module('app')
  .controller('quiz-controller', quiz_controller);

  quiz_controller.$inject = ['$routeParams', '$scope', '$window', 'QuizService'];

  function quiz_controller($routeParams, $scope, $window, QuizService) {
    let questionnaire_id = 1;
    let count = 0;
    $scope.user = [];
    $scope.quizArray = [];
    let numArray = [];

    $scope.quiz_get = () => {
			QuizService
			.get_quiz(questionnaire_id)
			.then(function(res) {
        $scope.user = res;
        
        for (let i=0; i<5; i++) {
          let math = Math.floor(Math.random() * 5);

          if (jQuery.inArray(math, numArray) == -1) numArray[count++] = math;
          else i--;
        }

        count = 0;
        $scope.quiz = $scope.user[numArray[count]].question_desc;

      }, function(err) {
				console.log(err);
			})
    }
    
    $scope.quiz_next = () => {
      if (count < 4) $scope.quiz = $scope.user[numArray[++count]].question_desc;      
    }

    $scope.quiz_prev = () => {
      if (count > 0) $scope.quiz = $scope.user[numArray[--count]].question_desc;      
    }
  }
  
})();