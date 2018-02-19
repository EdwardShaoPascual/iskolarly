'use strict';

(() => {
  angular
  .module('app')
  .controller('question-controller', question_controller);

  question_controller.$inject = ['$routeParams', '$scope', '$window', 'QuestionService'];

  function question_controller($routeParams, $scope, $window, QuestionService) {
    let questionnaire_id = $routeParams.questionnaire_id;
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
        $('#val_name').val($scope.user[0].questionnaire_name);
        console.log($scope.user[0].questionnaire_name);
			}, function(err) {
				console.log(err);
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
        swal("Oops!", "Fill all the missing fields!", "error");        
				console.log(err);
			})
    }
  }

})();