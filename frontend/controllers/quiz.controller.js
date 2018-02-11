'use strict';

(() =>{
	angular
	.module('app')
	.controller('quiz-controller', quiz_controller);

  quiz_controller.$inject = ['$routeParams', '$scope', '$window', 'QuizService'];

	function quiz_controller($routeParams, $scope, $window, QuizService) {
		$scope.user = [];

		$scope.questionnairesData = {
      question_name: '',
      question_desc: ''
    }

    $scope.questionnairesInfo = {
      question_id: '',
      question_name: '',
      question_desc: ''
    }

		$scope.questionnaires_view = () => {
			QuizService
			.view_questionnaires()
			.then(function(res) {
				$scope.user = res;
			}, function(err) {
				console.log(err);
			})
		}

		$scope.questionnaires_add = () => {
			QuizService
			.add_questionnaires($scope.questionnairesData)
			.then(function(res) {
        $scope.user = res;
        swal({
          title: "Success!",
          text: "File has been added.",
          type: "success"
        })
			}, function(err) {
        swal("Oops!", "Fill all the missing fields!", "error");        
				console.log(err);
			})
    }
    
    $scope.questionnaires_get_info = (data) => {
      $scope.question_id = data;

			QuizService
			.get_info_questionnaires($scope.question_id)
			.then(function(res) {
        $scope.questionnairesInfo = res[0];
        $('#edit_quest_id').val($scope.questionnairesInfo.question_id);
        $('#edit_quest_name').val($scope.questionnairesInfo.question_name);
        $('#edit_quest_desc').val($scope.questionnairesInfo.question_desc);
			}, function(err) {
				console.log(err);
			})
    }
    
    $scope.questionnaires_edit = () => {
      let question_id = $('#edit_quest_id').val();
      let question_name = $('#edit_quest_name').val();
      let question_desc = $('#edit_quest_desc'). val();

      $scope.edit_questionnairesData = {
        question_id: question_id,
        question_name: question_name,
        question_desc: question_desc
      }

      QuizService
      .edit_questionnaires($scope.edit_questionnairesData)
      .then(function(res) {
        swal({
          title: "Success!",
          text: "File has been added.",
          type: "success"
        })
      }, function(err) {
        console.log(err);
      })
    }

    $scope.questionnaires_delete = (data) => {
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
        QuizService
        .delete_questionnaires($scope.question_id)
        .then(function(res) {
          swal({
            title: "Success!",
            text: "File has been deleted.",
            type: "success"
          })
        }, function(err) {
          console.log(err);
        })
      });
    }
  }

})();