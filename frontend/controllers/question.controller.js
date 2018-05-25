'use strict';

(() => {
  angular
  .module('app')
  .controller('question-controller', question_controller);

  question_controller.$inject = ['$route', '$routeParams', '$scope', '$rootScope', '$window', 'QuestionService'];

  function question_controller($route, $routeParams, $scope, $rootScope, $window, QuestionService) {
    let questionnaire_id = $routeParams.questionnaire_id;
    $scope.isDisabled = true;
    $scope.questionnaire_info = {};
    $scope.questionnaire = {
      question_no: '',
      attempts: ''
    }
    $rootScope.typeText;
    $rootScope.items;
    $rootScope.user;
    
    $scope.questionsData = {
      questionnaire_id: questionnaire_id,
      question_desc: '',
      type: ''
    }

    // MVC listing out the questions
    $scope.questions_view = () => {
			QuestionService
			.view_questions(questionnaire_id)
			.then(function(res) {
        $scope.user = res;
        $rootScope.user = res;
			}, function(err) {
			})
		}

    // MVC getting the questions
    $scope.questions_get = () => {
			QuestionService
			.get_questions(questionnaire_id)
			.then(function(res) {
        if (res.length !== 0) {
          $scope.questionnaire_info = res;
          $rootScope.items = $scope.questionnaire_info[0].items;
          $('#val_name').text($scope.questionnaire_info[0].questionnaire_name);
          $('#items').text($scope.questionnaire_info[0].items + " items");
        }
			}, function(err) {
			})
    }

    // MVC checking the questions
    $scope.questions_check = () => {
      QuestionService
      .check_questions($scope.questionsData)
      .then(function(res) {
        if (res[0].size >= res[0].items || res[0].items === null) {
          $scope.isDisabled = true;
          return false;
        } else {
          $scope.isDisabled = false;
          return true;
        }
      }, function(err) {
			})
    }
    
    // MVC posting and adding a question
		$scope.questions_add = (data) => {    
      let id;
      let flag = 0;
      if (data == 0) id = $("input[type=text]:last").attr("id");
      else id = $("input[type=url]:last").attr("id");
      for (let i=0; i<=parseInt(id.substr(id.length -1)); i++) {
        let a, b;
        if (data == 0) {
          a = $('#answer_'+i).val();
          b = $('#right_'+i).val();
        } else {
          a = $('#answers_'+i).val();
          b = $('#rights_'+i).val();
        }

        if(a != undefined && b != undefined) {
          if (b == 'Yes') {
            flag = 1;
            break;
          }
        }
      }

      if (flag == 1) {
        QuestionService
        .add_questions($scope.questionsData)
        .then(function(res) {
          $('.modal').hide();
          $('.modal').modal('hide');
          swal({
            title: "Success!",
            text: "Question has been added.",
            type: "success"
          })
          location.reload();        
        }, function(err) {
          swal("Oops!", "Fill all fields", "error");
        })
      } else {
        toastr.error('At least one of the choices is right!','Error')        
      }
    }

    // MVC permanently delete question
    $scope.questions_delete = (data, index) => {
      $scope.question_id = data;
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this file!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },
      function(){
        QuestionService
        .delete_questions($scope.question_id)
        .then(function(res) {
          swal({
            title: "Success!",
            text: "Question has been deleted.",
            type: "success"
          }, () => {
            location.reload();            
          })
          $scope.user.splice(index, 1);
          $('.modal').hide();
          $('.modal').modal('hide');          
        }, function(err) {
        })
      });
    }

    // MVC getting the questions information
    $scope.questions_get_info = (data) => {
      $scope.question_id = data;

			QuestionService
			.get_info_questions($scope.question_id)
			.then(function(res) {
        $scope.questionsInfo = res[0];
        $('#edit_quest_id').val($scope.questionsInfo.question_id);
        
        if ($scope.questionsInfo.type == 'Image')
          $rootScope.typeText = false;
        else
          $rootScope.typeText = true;
			}, function(err) {
			})
    }

    // MVC listing out the answers to a given question
    $scope.answers_view = (data, index) => {
      $scope.answer = [];
      $scope.question_id = data;

      QuestionService
      .view_answers($scope.question_id)
      .then(function(res) {
        $scope.answer[index] = res;
      }, function(err) {
      })
    }

    // MVC posting and adding answers to a specific question
    $scope.answers_add = (data) => {    
      let id;
      let flag = 0;
      if (data == 0) id = $("input[type=text]:last").attr("id");
      else id = $("input[type=url]:last").attr("id");

      for (let i=0; i<=parseInt(id.substr(id.length -1)); i++) {
        let a, b;
        if (data == 0) {
          a = $('#answer_'+i).val();
          b = $('#right_'+i).val();
        } else {
          a = $('#answers_'+i).val();
          b = $('#rights_'+i).val();
        }

        if(a != undefined && b != undefined) {
          if (b == 'Yes') {
            flag = 1;
            break;
          }
        }
      }

      if (flag == 1) {
        for(let i=0; i<=parseInt(id.substr(id.length -1)); i++) {
          let a, b;
          if (data == 0) {
            a = $('#answer_'+i).val();
            b = $('#right_'+i).val();
          } else {
            a = $('#answers_'+i).val();
            b = $('#rights_'+i).val();
          }

          if(a != undefined && b != undefined) {
            $scope.answersData = {
              choices: a,
              is_right: b
            }

            QuestionService
            .add_answers($scope.answersData)
            .then(function(res) {
              $scope.user = res;
              swal({
                title: "Success!",
                text: "File has been added.",
                type: "success"
              })
              $('.modal').hide();
              $('.modal').modal('hide');          
            }, function(err) {
              swal("Oops!", "Fill all fields", "error");
            })
          }
        }
      }
    }

    // MVC permanently delete answer
    $scope.answers_delete = (data) => {
      $scope.answer_id = data;
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },
      function(){
        QuestionService
        .delete_answers($scope.answer_id)
        .then(function(res) {
          swal({
            title: "Success!",
            text: "File has been deleted.",
            type: "success"
          })     
        }, function(err) {
        })
      });
    }

    // MVC publishing quiz to make it accessible for the students
    $scope.publish_quiz = (id) => {
      let url = window.location.href
      let res = url.split("/");
      $scope.questionnaire.user_id = id;
      $scope.questionnaire.questionnaire_id = $routeParams.questionnaire_id;
      $scope.questionnaire.items = $rootScope.items;

      if ($scope.questionnaire.items > $rootScope.user.length) {
        toastr.error('Insufficient questions in the pool for this quiz before publishing!','Error')
      } else if ($scope.questionnaire.question_no > $scope.questionnaire.items) {
        toastr.error('Questions to display should be lower or equal to the number of items!','Error')
      } else {
        QuestionService
        .publish_quiz($scope.questionnaire)
        .then(function(res) {
          swal({
            title: "Success!",
            text: "File has been added.",
            type: "success"
          })
          $('.modal').hide();
          $('.modal').modal('hide');
        }, function(err) {
        })
      }
    }

  }

})();