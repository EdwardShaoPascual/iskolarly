'use strict';

(() =>{
	angular
	.module('app')
	.controller('quiz-controller', quiz_controller);

  quiz_controller.$inject = ['$scope', '$window', 'QuizService'];

	function quiz_controller($scope, $window, QuizService) {
		$scope.user = [];

		$scope.questionnaires_view = function() {
			QuizService
			.view_questionnaires()
			.then(function(res) {
				$scope.user = res;
			}, function(err) {
				console.log(err);
			})
		}
	}

})();