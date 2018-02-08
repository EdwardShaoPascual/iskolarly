'use strict';

(() =>{
	angular
	.module('app')
	.controller('quiz-controller', quiz_controller);

  quiz_controller.$inject = ['$scope', '$window', 'QuizService'];

	function quiz_controller($scope, $window, QuizService) {
		$scope.user = [];

		$scope.questionnairesData = {
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
        swal("Success!", "File has been added.", "success");
			}, function(err) {
        swal("Oops!", "Fill all the missing fields!", "error");        
				console.log(err);
			})
		}
	}

})();