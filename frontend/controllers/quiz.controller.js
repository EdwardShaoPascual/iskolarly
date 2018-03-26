'use strict';

(() => {
  angular
  .module('app')
  .controller('quiz-controller', quiz_controller);

  quiz_controller.$inject = ['$routeParams', '$scope', '$window', 'QuizService'];

  function quiz_controller($routeParams, $scope, $window, QuizService) {
    var vm = this;
    var numQuestionsAnswered = 0;

    let count = 0;
    let numArray = [];

    $scope.size = 0;
    $scope.user = [];
    var quizQuestions = new Array();

    vm.quizQuestions = quizQuestions;  
    vm.setActiveQuestion = setActiveQuestion;
    vm.questionAnswered = questionAnswered;
    vm.questionAnsweredPrev = questionAnsweredPrev;
    vm.selectAnswer = selectAnswer;
    vm.activeQuestion = 0;
    vm.error = false;
    vm.finalise = false;

    $scope.quiz_get = () => {
			QuizService
			.get_quiz($routeParams.questionnaire_id)
			.then(function(res) {
        $scope.user = res;
        $scope.size = $scope.user.length
        
        for (let i=0; i<$scope.size; i++) {
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
              jsonArg.question_desc = $scope.user[math].question_desc;
              jsonArg.selected = null;
              jsonArg.correct = null;
              jsonArg.set_of_choices = $scope.users;

              quizQuestions.push(jsonArg);
              console.log(quizQuestions)
            }, function(errt) {
              console.log(errt);
            })
            
          } else {
            i--;
          }
        }


        // count = 0;
        // $scope.quiz = $scope.user[numArray[count]].question_desc;
        // $scope.question_no = count + 1;
        // $scope.answer = [];
        
        // $scope.question_id = $scope.user[numArray[count]].question_id;
        // QuizService
        // .get_answers($scope.question_id)
        // .then(function(rest) {
        //   $scope.answer = rest;
        // }, function(errt) {
        //   console.log(errt);
        // })
        
      }, function(err) {
				console.log(err);
			})
    }

    
    
    // $scope.quiz_next = () => {
    //   if (count < $scope.size-1) {

    //     console.log(pluginArrayArg)
    //     $scope.answer = [];

    //     $scope.quiz = $scope.user[numArray[++count]].question_desc;
        
    //     $scope.question_id = $scope.user[numArray[count]].question_id;
    //     QuizService
    //     .get_answers($scope.question_id)
    //     .then(function(res) {
    //       $scope.answer = res;
    //     }, function(err) {
    //       console.log(err);
    //     })

    //     $scope.question_no = count + 1;        

    //   }
    // }

    // $scope.quiz_prev = () => {
    //   if (count > 0) {
    //     $scope.answer = [];

    //     $scope.quiz = $scope.user[numArray[--count]].question_desc;
        
    //     $scope.question_id = $scope.user[numArray[count]].question_id;
    //     QuizService
    //     .get_answers($scope.question_id)
    //     .then(function(res) {
    //       $scope.answer = res;
    //     }, function(err) {
    //       console.log(err);
    //     })

    //     $scope.question_no = count + 1;
        
    //   }
    // }

    function setActiveQuestion(index) {
      if(index === undefined) {
        var breakOut = false;
        var quizLength = vm.quizQuestions.length - 1;

        while(!breakOut) {
          vm.activeQuestion = vm.activeQuestion < quizLength?++vm.activeQuestion:0;

          if(vm.activeQuestion === 0) {
            vm.error = true;
          }
          
          if(quizQuestions[vm.activeQuestion].selected === null) {
            breakOut = true;
          }
        }
      } else {
        vm.activeQuestion = index;
      }
    }

    function questionAnswered() {
      var quizLength = vm.quizQuestions.length - 1;
      numQuestionsAnswered = 0;
      
      for(var x = 0; x < quizLength; x++) {
        if(vm.quizQuestions[vm.activeQuestion].selected !== null) {
          numQuestionsAnswered++;
          
          if(numQuestionsAnswered >= quizLength) {
            for(var i = 0; i < quizLength; i++) {
              if(vm.quizQuestions[i].selected === null) {
                setActiveQuestion(i);
                return;
              }
            }

            vm.error = false;
            vm.finalise = true;
            return;
          }
        }
      }

      vm.setActiveQuestion();
    }

    function questionAnsweredPrev() {
      var quizLength = vm.quizQuestions.length-1;
      numQuestionsAnswered = 0;

      console.log(quizLength)
      console.log(numQuestionsAnswered)
      
      for(var x = quizLength; x >= 0; x--) {
        console.log(x)
        
        if(vm.quizQuestions[vm.activeQuestion].selected !== null) {
          numQuestionsAnswered++;

          console.log(x)
          
          if(numQuestionsAnswered >= quizLength) {
            for(var i = quizLength; i >= 0; i--) {
              if(vm.quizQuestions[i].selected === null) {
                setActiveQuestion(i);
                return;
              }
            }

            vm.error = false;
            vm.finalise = true;
            return;
          }
        }
      }

      vm.setActiveQuestion();
    }

    function selectAnswer(index) {
      vm.quizQuestions[vm.activeQuestion].selected = index;
    }
  }
  
})();