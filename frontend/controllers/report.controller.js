'use strict';
 
(() =>{
	angular
		.module('app')
		.controller('report-controller',report_controller);

    report_controller.$inject = ['$scope', '$window', '$interval', 'ReportService'];    

		function report_controller($scope, $window, $interval, ReportService) {

      $scope.display = '';
      $scope.course_selected = '0';
      $scope.questionnaire_selected = '';
      $scope.questionnaires = {};

      $scope.assign = (courses) => {
        console.log(courses);
      }

      $scope.list_questionnaires = () => {
        ReportService
        .list_questionnaires()
        .then(function(res) {
          $scope.questionnaires = res;
        }, function(err) {
          toastr.error(err.message, 'Error');
        })
      }

      $scope.generate_report = () => {
        $scope.course_selected = $('#course_selected').val();
        $scope.questionnaire_selected = $('#questionnaire_selected').val();
      }

		}
})();
