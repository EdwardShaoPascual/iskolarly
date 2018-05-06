'use strict';
 
(() =>{
	angular
		.module('app')
		.controller('report-controller',report_controller);

    report_controller.$inject = ['$scope', '$window', '$interval', '$rootScope', 'ReportService'];    

    function report_controller($scope, $window, $interval, $rootScope, ReportService) {

      $scope.display = 'Quiz';
      $scope.questionnaires = {};
      $scope.activity_log = {};
      $scope.quiz_log = {
        ave_time_all: ''
      }
      $scope.report_data = {
        course_selected: '',
        questionnaire_selected: ''
      };

      $scope.list_questionnaires = () => {
        ReportService
        .list_questionnaires()
        .then(function(res) {
          $scope.questionnaires = res;
          console.clear();
        }, function(err) {
          toastr.error(err.message, 'Error');
        })
      }

      $scope.generate_report = () => {
        $scope.report_data.course_selected = $('#course_selected').val();
        $scope.report_data.questionnaire_selected = $('#questionnaire_selected').val();
        if (($scope.report_data.course_selected === '' || $scope.report_data.questionnaire_selected === null) && $scope.display === 'Quiz') {
          toastr.error("Invalid choice of course or quiz", "Error");
        } else {
          ReportService.
          retrieve_activity_logs()
          .then(function(res) {
            $scope.activity_log = res;
            if ($scope.display === 'Quiz') {
              let filtered_quiz = [];
              let filtered_quiz_start = [];
              let filtered_quiz_end = [];
              // Getting the quiz-related logs
              for(let i=0; i<res.length; i++) {
                if (res[i].activity_type.includes('Quiz') && res[i].activity_info.includes("questionnaire_id="+$scope.report_data.questionnaire_selected)) {
                  filtered_quiz.push(res[i]);
                }
                if (res[i].activity_type.includes('Quiz Start') && res[i].activity_info.includes("questionnaire_id="+$scope.report_data.questionnaire_selected)) {
                  filtered_quiz_start.push(res[i]);
                }
                if (res[i].activity_type.includes('Quiz End') && res[i].activity_info.includes("questionnaire_id="+$scope.report_data.questionnaire_selected)) {
                  filtered_quiz_end.push(res[i]);
                }
              }
              
              // For averaging time (overall)
              let ave_time = 0;
              for(let i=0; i<filtered_quiz_end.length; i++) {
                let referDate = '';
                let date = filtered_quiz_end[i].activity_info.split(' ')[0].replace('[','').replace(']','');
                let reference = filtered_quiz_end[i].activity_info.split(' ')[7].split('=')[1];
                for(let j=0; j<filtered_quiz_start.length; j++) {
                  if (filtered_quiz_start[j].activity_id == reference) {
                    referDate = filtered_quiz_start[i].activity_info.split(' ')[0].replace('[','').replace(']','');
                    break;
                  }
                }
                ave_time = ave_time + (new Date(date) - new Date(referDate));
              }
              ave_time /= filtered_quiz_end.length;
              let average = new Date(ave_time);
              let seconds = average.getSeconds();
              let minutes = average.getMinutes();
              let hour = Math.floor(minutes/60);
              let final_time = {
                seconds: seconds+"."+ave_time.toString().substring(0,2),
                minutes: minutes%60,
                hour: hour
              }
              // End of averaging time (overall) 
              
            }
          }, function(err) {
              toastr.error(err.message, "Error");
          })
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
