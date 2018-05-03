'use strict';
 
(() =>{
	angular
		.module('app')
		.controller('report-controller',report_controller);

    report_controller.$inject = ['$scope', '$window', '$interval', 'ReportService'];    

		function report_controller($scope, $window, $interval, ReportService) {

      $scope.display = '';
      $scope.course_selected = '';
      $scope.questionnaires = {};

      $scope.rerender = () => {
        $(document).ready(function() {
          $('.js-example-basic-single').select2();
        });
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

		}
})();
