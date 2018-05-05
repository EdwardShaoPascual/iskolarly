'use strict';
 
(() =>{
	angular
		.module('app')
		.controller('report-controller',report_controller);

    report_controller.$inject = ['$scope', '$window', '$interval', '$rootScope', 'ReportService'];    

    function report_controller($scope, $window, $interval, $rootScope, ReportService) {

      $scope.display = 'Quiz';
      $scope.questionnaires = {};
      $scope.report_data = {
        course_selected: '',
        questionnaire_selected: ''
      };

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
        $scope.report_data.course_selected = $('#course_selected').val();
        $scope.report_data.questionnaire_selected = $('#questionnaire_selected').val();
        if (($scope.report_data.course_selected === '' || $scope.report_data.questionnaire_selected === null) && $scope.display === 'Quiz') {
          toastr.error("Invalid choice of course or quiz", "Error");
        }
      }

      $scope.initialize_graph = () => {
        let ctx = document.getElementById("passrate");
        let myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: ["Passed", "Failed"],
              datasets: [{
                  label: '# of Votes',
                  data: [50,100],
                  backgroundColor: [
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 99, 132, 0.2)'
                  ],
                  borderColor: [
                      'rgba(54, 162, 235, 1)',
                      'rgba(255,99,132,1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              
          }
        });
        ctx = document.getElementById("myChart1");
        myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: ["Passed", "Failed"],
              datasets: [{
                  label: '# of Votes',
                  data: [106,34],
                  backgroundColor: [
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 99, 132, 0.2)'
                  ],
                  borderColor: [
                      'rgba(54, 162, 235, 1)',
                      'rgba(255,99,132,1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              
          }
        });
        ctx = document.getElementById("timetable");
        myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: ["Aug. 1", "Aug. 2", "Aug. 3", "Aug. 4", "Aug. 5", "Aug. 6", "Aug. 7", "Aug. 8", "Aug. 9", "Aug. 10", "Aug. 11"],
              xAxisID: "Quiz Time Span",
              yAxisID: "Students' Score",
              datasets: [{
                  label: 'Average score of students per day',
                  data: [0,5,15,11,10,4,12,7,15,14,11,15],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              
          }
        });
      }

		}
})();
