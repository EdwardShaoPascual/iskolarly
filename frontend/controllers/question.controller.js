'use strict';

(() => {
  angular
  .module('app')
  .controller('question-controller', question_controller);

  question_controller.$inject = ['$routeParams', '$scope', '$window', 'QuestionService'];

  function question_controller($routeParams, $scope, $window, QuestionService) {
    let questionnaire_id = $routeParams.questionnaire_id;
    $scope.isDisabled = true;
    $scope.user = [];

    $scope.questionsData = {
      questionnaire_id: questionnaire_id,
      question_desc: ''
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
			}, function(err) {
        swal("Oops!", "Max question", "error");
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
        }, function(err) {
          console.log(err);
        })
      });
    }

    $scope.answers_add = () => {
			QuestionService
			.add_answers($scope.answersData)
			.then(function(res) {
        $scope.user = res;
        swal({
          title: "Success!",
          text: "File has been added.",
          type: "success"
        })
			}, function(err) {
        swal("Oops!", "Max question", "error");
				console.log(err);
			})
    }
  }

})();