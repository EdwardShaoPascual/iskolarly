'use strict';

(() => {
	angular
	.module('app')
	.controller('questionnaire-controller', questionnaire_controller);

  questionnaire_controller.$inject = ['$scope', '$window', 'QuestionnaireService'];

	function questionnaire_controller($scope, $window, QuestionnaireService) {
		$scope.user = new Array();

		$scope.questionnairesData = {
      questionnaire_name: '',
      questionnaire_desc: '',
      questionnaire_no: ''
    }

    $scope.questionnairesInfo = {
      questionnaire_id: '',
      questionnaire_name: '',
      questionnaire_desc: '',
      questionnaire_no: ''
    }

		$scope.questionnaires_view = () => {
			QuestionnaireService
			.view_questionnaires()
			.then(function(res) {
        for (let i=0; i < res.length; i++) {
          $scope.user.push(res[i]);
        }
			}, function(err) {
				console.log(err);
      })
		}

		$scope.questionnaires_add = () => {
      $scope.questionnaires_view();
      let data = {
        questionnaire_id: '',
        questionnaire_name: '',
        questionnaire_desc: '',
        questionnaire_no: ''
      }
			QuestionnaireService
			.add_questionnaires($scope.questionnairesData)
			.then(function(res) {
        data.questionnaire_id = res.insertId;
        data.questionnaire_name = $scope.questionnairesData.questionnaire_name;
        data.questionnaire_desc = $scope.questionnairesData.questionnaire_desc;
        data.questionnaire_no = $scope.questionnairesData.questionnaire_no;
        swal({
          title: "Success!",
          text: "File has been added.",
          type: "success"
        }, () => {
          location.reload();          
        })
        $('#addQuestionnaire').modal('hide');
        $scope.user.push(data);
			}, function(err) {
				console.log(err);
        swal("Oops!", err.data, "error");
			})
    }
    
    $scope.questionnaires_get_info = (data) => {
      $scope.questionnaire_id = data;

			QuestionnaireService
			.get_info_questionnaires($scope.questionnaire_id)
			.then(function(res) {
        $scope.questionnairesInfo = res[0];
        $('#edit_quest_id').val($scope.questionnairesInfo.questionnaire_id);
        $('#edit_quest_name').val($scope.questionnairesInfo.questionnaire_name);
        $('#edit_quest_desc').val($scope.questionnairesInfo.questionnaire_desc);
        $('#edit_quest_no').val($scope.questionnairesInfo.questionnaire_no);
			}, function(err) {
				console.log(err);
			})
    }
    
    $scope.questionnaires_edit = () => {
      let questionnaire_id = $('#edit_quest_id').val();
      let questionnaire_name = $('#edit_quest_name').val();
      let questionnaire_desc = $('#edit_quest_desc'). val();
      let questionnaire_no = $('#edit_quest_no').val();

      $scope.edit_questionnairesData = {
        questionnaire_id: questionnaire_id,
        questionnaire_name: questionnaire_name,
        questionnaire_desc: questionnaire_desc,
        questionnaire_no: questionnaire_no
      }

      QuestionnaireService
      .edit_questionnaires($scope.edit_questionnairesData)
      .then(function(res) {
        swal({
          title: "Success!",
          text: "File has been edited.",
          type: "success"
        })
      }, function(err) {
        swal("Oops!", "Check all the fields!", "error");
        console.log(err);
      })
    }

    $scope.questionnaires_delete = (data, index) => {
      $scope.questionnaire_id = data;
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
        QuestionnaireService
        .delete_questionnaires($scope.questionnaire_id)
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

    $scope.page_view = (data) => {
      $scope.questionnaire_id = data;

      window.location.href = '#/question/' + $scope.questionnaire_id;
    }
  }

})();