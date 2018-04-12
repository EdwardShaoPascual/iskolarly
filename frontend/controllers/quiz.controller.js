'use strict';

(() => {
  angular
  .module('app')
  .controller('quiz-controller', quiz_controller);

  quiz_controller.$inject = ['$routeParams', '$rootScope', '$scope', '$window', 'QuizService'];

  function quiz_controller($routeParams, $rootScope, $scope, $window, QuizService) {
    var numQuestionsAnswered = 0;

    let count = 0;
    let numArray = [];

    $scope.size = 0;
    $scope.user = [];
    $scope.quizQuestions = new Array();

    $scope.activeQuestion = 0;
    $scope.error = false;
    $scope.finalize = false;

    $scope.quizActive = true;
    $scope.resultsActive = false;
    $scope.correctAnswers = new Array();
    $scope.numCorrect = 0;
    $rootScope.questionnaire_name;

    $scope.quiz_get = () => {
			QuizService
			.get_quiz($routeParams.questionnaire_id)
			.then(function(res) {
        $scope.user = res;
        $scope.size = $scope.user.length;
        $rootScope.questionnaire_name = $scope.user[0].questionnaire_name;
        
        for (let i = 0; i < $scope.size; i++) {
          $scope.users = [];
          let math = Math.floor(Math.random() * $scope.size);

          if (jQuery.inArray(math, numArray) == -1) {
            numArray[count++] = math;
            
            $scope.question_id = $scope.user[math].question_id;
            QuizService
            .get_answers($scope.question_id)
            .then(function(rest) {
              $scope.users = rest;
              
              var jsonArg = new Object();
              jsonArg.type = $scope.user[math].type;
              jsonArg.question_desc = $scope.user[math].question_desc;
              jsonArg.selected = null;
              jsonArg.correct = null;
              $scope.choice = new Array();

              for (let i = 0; i < $scope.users.length; i++) {
                $scope.choice.push({ choices: '' + $scope.users[i].choices + '' });

                if ($scope.users[i].is_right === "Yes")
                  $scope.correctAnswers.push(i);
              }

              jsonArg.set_of_choices = $scope.choice;
              $scope.quizQuestions.push(jsonArg);
              console.log($scope.quizQuestions)
            }, function(errt) {
              console.log(errt);
            })
            
          } else {
            i--;
          }
        }
        
      }, function(err) {
				console.log(err);
			})
    }
    
    $scope.setActiveQuestion = (index) => {
      if(index === undefined) {
        var breakOut = false;
        var quizLength = $scope.quizQuestions.length - 1;

        while(!breakOut) {
          $scope.activeQuestion = $scope.activeQuestion < quizLength?++$scope.activeQuestion:0;

          if($scope.activeQuestion === 0) {
            $scope.error = true;
          }
          
          if($scope.quizQuestions[$scope.activeQuestion].selected === null) {
            breakOut = true;
          }
        }
      } else {
        $scope.activeQuestion = index;
      }
    }

    $scope.questionAnsweredNext = () => {
      var quizLength = $scope.quizQuestions.length;
      numQuestionsAnswered = 0;
      
      for(var x = 0; x < quizLength; x++) {
        if($scope.quizQuestions[$scope.activeQuestion].selected !== null) {
          numQuestionsAnswered++;
          
          if(numQuestionsAnswered >= quizLength) {
            for(var i = 0; i < quizLength; i++) {
              if($scope.quizQuestions[i].selected === null) {
                $scope.setActiveQuestion(i);
                return;
              }
            }

            $scope.error = false;
            $scope.finalize = true;
            return;
          }
        }
      }

      $scope.setActiveQuestion();
    }

    $scope.questionAnsweredPrev = () => {
      var quizLength = $scope.quizQuestions.length-1;
      numQuestionsAnswered = 0;

      for(var x = quizLength; x >= 0; x--) {
        if($scope.quizQuestions[$scope.activeQuestion].selected !== null) {
          numQuestionsAnswered++;
          
          if(numQuestionsAnswered >= quizLength) {
            for(var i = quizLength; i >= 0; i--) {
              if($scope.quizQuestions[i].selected === null) {
                $scope.setActiveQuestion(i);
                return;
              }
            }

            $scope.error = false;
            $scope.finalize = true;
            return;
          }
        }
      }

      $scope.setActiveQuestion();
    }

    $scope.selectAnswer = (index) => {
      $scope.quizQuestions[$scope.activeQuestion].selected = index;
    }

    $scope.finalAnswers = () => {
      $scope.finalize = false;
      $scope.activeQuestion = 0;
      numQuestionsAnswered = 0;

      $scope.markQuiz();
      $scope.changeState("quiz", false);
      $scope.changeState("results", true);
    }

    $scope.changeState = (metric, state) => {
      if (metric === "quiz") {
        $scope.quizActive = state;
      } else if (metric === "results") {
        $scope.resultsActive = state;
      } else {
        return false;
      }
    }

    $scope.setResActiveQuestion = (index) => {
      $scope.activeQuestion = index;
    }

    $scope.markQuiz = () => {
      for (let i = 0; i < $scope.quizQuestions.length; i++) {
        if ($scope.quizQuestions[i].selected === $scope.correctAnswers[i]) {
          $scope.quizQuestions[i].correct = true;
          $scope.numCorrect++;
        } else {
          $scope.quizQuestions[i].correct = false;
        }
      }
    }

    $scope.calculatePerc = () => {
      return $scope.numCorrect / $scope.quizQuestions.length * 100;
    }

    $scope.getAnswerClass = (index) => {
      if (index === $scope.correctAnswers[$scope.activeQuestion]) {
        return "bg-success";
      } else if (index === $scope.quizQuestions[$scope.activeQuestion].selected){
        return "p-3 mb-2 bg-danger";
      }
    }

    $scope.reset = () => {
      $scope.changeState("results", false);
      $scope.changeState("quiz", true);
      $scope.numCorrect = 0;

      for(var i = 0; i < $scope.quizQuestions.length; i++){
        var data = $scope.quizQuestions[i];
        data.selected = null;
        data.correct = null;
      }
    }
  }
  
})();