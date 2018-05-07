'use strict';
 
(() =>{
	angular
		.module('app')
		.controller('report-controller',report_controller);

    report_controller.$inject = ['$scope', '$window', '$interval', '$rootScope', 'ReportService'];    

    function report_controller($scope, $window, $interval, $rootScope, ReportService) {

      $scope.loading = 0;
      $scope.display = 'Quiz';
      $scope.questionnaires = {};
      $scope.activity_log = {};
      $scope.course_users = {};
      $scope.timeTable = {
        dateArray: [],
        dataArray: []
      };
      $scope.over_score = 0;
      $scope.get_flag = 0;
      $scope.standing = {
        pass: 0,
        fail: 0
      }
      $scope.quiz_log = {
        ave_time_all: ''
      }
      $scope.report_data = {
        course_selected: '',
        questionnaire_selected: ''
      };
      $scope.final_time = {
        seconds: '',
        minutes: '',
        hour: ''
      }
      $scope.final_time_highest = {
        seconds: '',
        minutes: '',
        hour: ''
      }
      $scope.average_scores = {
        normal: '',
        normal_percentage: '',
        highest: '',
        highest_percentage: ''
      }

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
        $scope.display = $('#display').val();
        ReportService
        .retrieve_user($scope.report_data)
        .then(function(res) {
          $scope.course_users = res;
          if ($scope.display === 'Quiz' && ($scope.report_data.course_selected === '' || $scope.report_data.questionnaire_selected === null || $scope.report_data.course_selected === '? string: ?')) {
            toastr.error("Invalid choice of course or quiz", "Error");
            $scope.report_data.course_selected = '';
          } 
          else if ($scope.display === 'Activity Log' && ($scope.report_data.course_selected === '' || $scope.report_data.course_selected === null || $scope.report_data.course_selected === '? string: ?')) {
            toastr.error("Invalid choice of course for activity logging", "Error");
            $scope.report_data.course_selected = '';
          }
          else {
            $scope.loading = 1;
            ReportService
            .retrieve_quiz_items($scope.report_data)
            .then(function(res) {
              $scope.over_score = res[0].question_no;
              ReportService
              .retrieve_activity_logs()
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
                  let score_ave = 0;
                  for(let i=0; i<filtered_quiz_end.length; i++) {
                    let referDate = '';
                    let date = filtered_quiz_end[i].activity_info.split(' ')[0].replace('[','').replace(']','');
                    let reference = filtered_quiz_end[i].activity_info.split(' ')[7].split('=')[1];
                    for(let j=0; j<filtered_quiz_start.length; j++) {
                      if (filtered_quiz_start[j].activity_id == reference) {
                        referDate = filtered_quiz_start[j].activity_info.split(' ')[0].replace('[','').replace(']','');
                        break;
                      }
                    }
                    ave_time = ave_time + (new Date(date) - new Date(referDate));
                    score_ave += parseInt(filtered_quiz_end[i].activity_info.split(' ')[5].split('=')[1]);
                  }
                  score_ave /= filtered_quiz_end.length;
                  ave_time /= filtered_quiz_end.length;
                  let average = new Date(ave_time);
                  let seconds = average.getSeconds();
                  let minutes = average.getMinutes();
                  let hour = Math.floor(minutes/60);
                  $scope.average_scores.normal = score_ave;
                  $scope.average_scores.normal_percentage = ((score_ave / $scope.over_score) * 100).toFixed(2);
                  $scope.final_time = {
                    seconds: seconds+"."+ave_time.toString().substring(0,2),
                    minutes: minutes%60,
                    hour: hour
                  }
                  // End of averaging time (overall) 

                  $scope.dateLabels = new Map();

                  // For averaging time (highest), getting the Pass/Fail graph and getting the highest average
                  let highest_ave = 0;
                  ave_time = 0;
                  for(let i=0; i<$scope.course_users.length; i++) {
                    let scores = [];
                    let highest = -99999999;
                    // Get your quizzes
                    for(let j=0; j<filtered_quiz_end.length; j++) {
                      if (filtered_quiz_end[j].activity_info.includes("user_id=" + $scope.course_users[i].user_id)) {
                        let dateString = filtered_quiz_end[j].activity_info.split(' ')[0].replace('[','').replace(']','');
                        let date = dateFormat('%M %d %Y', new Date(dateString))

                        if (!$scope.dateLabels.has(date)) {
                          $scope.dateLabels.set(date, 1);
                        } else {
                          $scope.dateLabels.set(date, $scope.dateLabels.get(date)+1)
                        }

                        scores.push(filtered_quiz_end[j]);
                      }
                    }
                    // Get the highest score
                    for(let j=0; j<scores.length; j++) {
                      if (scores[j].activity_info.split(' ')[5].split('=')[1] > highest) {
                        highest = scores[j].activity_info.split(' ')[5].split('=')[1];
                      }
                    }
                    highest_ave += parseInt(highest);
                    // Get the passing and failing rate
                    if ((highest) >= ($scope.over_score * 0.60)) {
                      $scope.standing.pass++;
                    } else {
                      $scope.standing.fail++;
                    }
                    // Get the average if two or more with higher score exists
                    let highestCount = 0;
                    let ave_time_iteration = 0;
                    for(let j=0; j<scores.length; j++) {
                      if (scores[j].activity_info.split(' ')[5].split('=')[1] == highest) {
                        let referDate = '';
                        let date = scores[j].activity_info.split(' ')[0].replace('[','').replace(']','');
                        let reference = scores[j].activity_info.split(' ')[7].split('=')[1];
                        for(let j=0; j<filtered_quiz_start.length; j++) {
                          if (filtered_quiz_start[j].activity_id == reference) {
                            referDate = filtered_quiz_start[j].activity_info.split(' ')[0].replace('[','').replace(']','');
                            break;
                          }
                        }
                        ave_time_iteration = ave_time_iteration + (new Date(date) - new Date(referDate));
                        highestCount++;
                      }
                    }
                    ave_time = ave_time + (ave_time_iteration/highestCount);
                  };
                  highest_ave /= $scope.course_users.length;
                  ave_time /= $scope.course_users.length;
                  average = new Date(ave_time);
                  seconds = average.getSeconds();
                  minutes = average.getMinutes();
                  hour = Math.floor(minutes/60);
                  $scope.average_scores.highest = highest_ave;
                  $scope.average_scores.highest_percentage = ((highest_ave/$scope.over_score) * 100).toFixed(2);
                  $scope.final_time_highest = {
                    seconds: seconds+"."+ave_time.toString().substring(0,2),
                    minutes: minutes%60,
                    hour: hour
                  }
                  // End of averaging time (highest)

                  $scope.timeTable.dateArray = Array.from($scope.dateLabels.keys())
                  $scope.timeTable.dataArray = Array.from($scope.dateLabels.values())

                  $scope.initialize_graph($scope.standing, $scope.timeTable);
                  $scope.get_flag = 1;
                  $scope.loading = 0;
                }
              }, function(err) {
                  toastr.error(err.message, "Error");
              });
            })
            
          }
        })

      }

      $scope.initialize_graph = (standing) => {
        // Passing/Failing Graph
        let ctx = document.getElementById("passrate");
        let myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: ["Passed", "Failed"],
              datasets: [{
                  label: '# of Votes',
                  data: [standing.pass,standing.fail],
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
        // Time Table
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
