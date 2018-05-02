'use strict';

(() => {
  angular
  .module('app')
  .controller('quiz-controller', quiz_controller);

  quiz_controller.$inject = ['$http', '$routeParams', '$rootScope', '$scope', '$window', 'QuizService'];

  function quiz_controller($http, $routeParams, $rootScope, $scope, $window, QuizService) {
    var numQuestionsAnswered = 0;
    let quizLength;
    let numQuestion = 1;

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
    $rootScope.questionnaire_id = $routeParams.questionnaire_id;

    $scope.quizData = {}
    $scope.questionData = {}
    $scope.scoreData = {}
    
    $scope.quiz_get = () => {
      var url = "//geoip.nekudo.com/api/";
      $http
      .get(url)
      .then(function(response) {
        $scope.quizData.ip = response.data.ip;
        $scope.quizData.questionnaire_id = $rootScope.questionnaire_id;
      })
      .then(function(response) {
        QuizService
        .get_quiz($rootScope.questionnaire_id, $scope.quizData)
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
                jsonArg.question_id = math + 1;
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
                quizLength = $scope.quizQuestions.length;
              }, function(errt) {
              })
              
            } else {
              i--;
            }
          }
          
          var url = "//geoip.nekudo.com/api/";
          $http
          .get(url)
          .then(function(response) {
            $scope.questionData.ip = response.data.ip;
            $scope.questionData.questionnaire_id = $rootScope.questionnaire_id;
            $scope.questionData.question_id = $scope.quizQuestions[0].question_id;
            $scope.questionData.activity = "Question " + $scope.quizQuestions[0].question_id + " Viewed";
          })
          .then(function(response) {
            QuizService
            .insert_questionlog($scope.questionData)
            .then(function(res) {

            }, function(er) {

            })
          });
          
        }, function(err) {
        })
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
      numQuestion = index+1;
      var url = "//geoip.nekudo.com/api/";
      $http
      .get(url)
      .then(function(response) {
        $scope.questionData.ip = response.data.ip;
        $scope.questionData.questionnaire_id = $rootScope.questionnaire_id;
        $scope.questionData.question_id = $scope.quizQuestions[$scope.activeQuestion].question_id;
        $scope.questionData.activity = "Question " + $scope.quizQuestions[$scope.activeQuestion].question_id + " Viewed";
      })
      .then(function(response) {
        QuizService
        .insert_questionlog($scope.questionData)
        .then(function(res) {
          $scope.user = res;
        }, function(err) {
        })
      })
    }

    $scope.questionAnsweredNext = () => {
      if (numQuestion < quizLength+1) {
        $scope.setActiveQuestion(numQuestion-1);

        var url = "//geoip.nekudo.com/api/";
        $http
        .get(url)
        .then(function(response) {
          $scope.questionData.ip = response.data.ip;
          $scope.questionData.questionnaire_id = $rootScope.questionnaire_id;
          $scope.questionData.question_id = $scope.quizQuestions[$scope.activeQuestion].question_id;
          $scope.questionData.activity = "Question " + $scope.quizQuestions[$scope.activeQuestion].question_id + " Viewed";
        })
        .then(function(response) {
          QuizService
          .insert_questionlog($scope.questionData)
          .then(function(res) {
            $scope.user = res;
          }, function(err) {
          })
        })

        numQuestion = numQuestion + 1;
      } else {
        $scope.error = false;
        $scope.finalize = true;
      }
    }

    $scope.questionAnsweredPrev = () => {


      if (numQuestion > 1) {
        numQuestion = numQuestion - 1;
        console.log(numQuestion)
        $scope.setActiveQuestion(numQuestion-1);
        
        var url = "//geoip.nekudo.com/api/";
        $http
        .get(url)
        .then(function(response) {
          $scope.questionData.ip = response.data.ip;
          $scope.questionData.questionnaire_id = $rootScope.questionnaire_id;
          $scope.questionData.question_id = $scope.quizQuestions[$scope.activeQuestion].question_id;
          $scope.questionData.activity = "Question " + $scope.quizQuestions[$scope.activeQuestion].question_id + " Viewed";
        })
        .then(function(response) {
          QuizService
          .insert_questionlog($scope.questionData)
          .then(function(res) {
            $scope.user = res;
          }, function(err) {
          })
        })
      }
    }

    $scope.selectAnswer = (index) => {
      $scope.quizQuestions[$scope.activeQuestion].selected = index;

      var url = "//geoip.nekudo.com/api/";
      $http
      .get(url)
      .then(function(response) {
        $scope.questionData.ip = response.data.ip;
        $scope.questionData.questionnaire_id = $rootScope.questionnaire_id;
        $scope.questionData.question_id = $scope.quizQuestions[$scope.activeQuestion].question_id;
        $scope.questionData.activity = "Question " + $scope.quizQuestions[$scope.activeQuestion].question_id + " Answered";
      })
      .then(function(response) {
        QuizService
        .insert_questionlog($scope.questionData)
        .then(function(res) {
          $scope.user = res;
        }, function(err) {
        })
      })
    }

    $scope.finalAnswers = () => {
      $scope.finalize = false;
      $scope.activeQuestion = 0;
      numQuestionsAnswered = 0;

      var url = "//geoip.nekudo.com/api/";
      $http
      .get(url)
      .then(function(response) {
        $scope.quizData.ip = response.data.ip;
        $scope.quizData.questionnaire_id = $rootScope.questionnaire_id;
      })
      .then(function(response) {
        QuizService
        .insert_quizlog($scope.quizData)
        .then(function(res) {
          $scope.user = res;
        }, function(err) {
        })
      })

      $scope.markQuiz();

      $scope.scoreData.score = $scope.numCorrect;
      $scope.scoreData.questionnaire_id = $rootScope.questionnaire_id;
      
      QuizService
      .insert_score($scope.scoreData)
      .then(function(res) {
      }, function(error) {
      })

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