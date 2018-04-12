'use strict';

(() => {
  angular
  .module('app')
  .controller('question-controller', question_controller);

  question_controller.$inject = ['$routeParams', '$scope', '$rootScope', '$window', 'QuestionService'];

  function question_controller($routeParams, $scope, $rootScope, $window, QuestionService) {
    let questionnaire_id = $routeParams.questionnaire_id;
    $scope.isDisabled = true;
    $rootScope.typeText;
    
    $scope.questionsData = {
      questionnaire_id: questionnaire_id,
      question_desc: '',
      type: ''
    }

    $scope.questions_view = () => {
			QuestionService
			.view_questions(questionnaire_id)
			.then(function(res) {
        $scope.user = res;
			}, function(err) {
				console.log(err);
			})
		}

    $scope.questions_get = () => {
			QuestionService
			.get_questions(questionnaire_id)
			.then(function(res) {
        $scope.user = res;
        $('#val_name').text($scope.user[0].questionnaire_name);
        $('#items').text($scope.user[0].questionnaire_no + " items");
			}, function(err) {
				console.log(err);
			})
    }

    $scope.questions_check = () => {
      QuestionService
      .check_questions($scope.questionsData)
      .then(function(res) {
        $scope.isDisabled = false;
        return true;
      }, function(err) {
        $scope.isDisabled = true;
        return false;
			})
    }
    
		$scope.questions_add = () => {
			QuestionService
			.add_questions($scope.questionsData)
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
				console.log(err);
			})
    }

    $scope.questions_delete = (data, index) => {
      $scope.question_id = data;
      console.log($scope.question_id);
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
            text: "File has been deleted.",
            type: "success"
          })
          $scope.user.splice(index, 1);
          $('.modal').hide();
          $('.modal').modal('hide');          
        }, function(err) {
          console.log(err);
        })
      });
    }

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

    $scope.answers_add = (data) => {
      $scope.question_id = $('#edit_quest_id').val();     
      let id = $("input[type=text]:last").attr("id")

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
          .add_answers($scope.answersData, $scope.question_id)
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

    $scope.answers_delete = (data) => {
      $scope.answer_id = data;
      // console.log(index);
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
          // $scope.user.splice(index, 1);
          // $('.modal').hide();
          // $('.modal').modal('hide');          
        }, function(err) {
          console.log(err);
        })
      });
    }
  }

})();