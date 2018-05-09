'use strict';
 
(() =>{
	angular
		.module('app')
		.controller('report-controller',report_controller);

    report_controller.$inject = ['$scope', '$window', '$interval', '$rootScope', 'ReportService'];    

    function report_controller($scope, $window, $interval, $rootScope, ReportService) {

      $scope.loading = 0;
      $scope.display = 'Quiz';
      $scope.arrayDataSet = [];
      $scope.questionnaires = {};
      $scope.activity_log = {};
      $scope.course_users = {};
      $scope.filtered = {
        quiz: [],
        quiz_end: [],
        quiz_start: []
      }
      $scope.timeTable = {
        dateArray: [],
        dataArray: []
      };
      $scope.over_score = 0;
      $scope.num_of_tries = 0;
      $scope.get_flag = 0;
      $scope.get_flag_student = 0;
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
      $scope.student = {
        user_id: '',
        ave_score: 0,
        ave_score_percentage: 0,
        ave_time_hours: 0,
        ave_time_minutes: 0,
        ave_time_seconds: 0,
        highest_score_percentage: 0,
        highest_ave_time_hours: 0,
        highest_ave_time_minutes: 0,
        highest_ave_time_seconds: 0
      }
      $scope.high = {
        user_highest: [],
        user_highest_time: []
      }

      $scope.exportData = () => {
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xls");
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

      $scope.generate_activity = () => {
        $scope.report_data.course_selected = $('#course_selected').val();
        if ($scope.report_data.course_selected === '? string: ?') {
          
        } else {
          $scope.arrayDataSet = [];
          $scope.numberArray = []
          ReportService
          .retrieve_activity_logs()
          .then(function(res) {
            for (let j=0; j<$scope.questionnaires.length; j++) {
              if ($scope.report_data.course_selected == $scope.questionnaires[j].course_id) {
                $scope.numberArray.push($scope.questionnaires[j].questionnaire_id);
              }
            }

            for (let i=0; i<res.length; i++) {
              let object = {
                id: null,
                date: null,
                activity_type: null,
                username: null,
                viewed_time: null,
                answered_time: null,
                started_time: null,
                ended_time: null,
                ipv4: null
              };

              if (res[i].activity_type.includes('Quiz') || res[i].activity_type.includes('Question')) {
    
                if ($scope.numberArray.includes(parseInt(res[i].activity_info.split(' ')[4].split('=')[1]))) {
                  
                  if (res[i].activity_type === 'Quiz Start') {
                    res[i].activity_type = 'Quiz Started';
                  } else if (res[i].activity_type === 'Quiz End') {
                    res[i].activity_type = 'Quiz Ended';
                  }

                  object.date = dateFormat('%M %d %Y', new Date(res[i].activity_info.split(' ')[0].replace('[','').replace(']','')));
                  object.id = res[i].activity_id;
                  object.id_questionnaire = res[i].activity_info.split(' ')[4].split('=')[1];
                  object.activity_type = res[i].activity_type;
                  object.username = res[i].activity_info.split(' ')[1].split('=')[1];
                  let data = res[i].activity_info.split(' ');
                  for (let i=0; i < data.length; i++) {
                    if (data[i].includes('ipv4=')) {
                      object.ipv4 = data[i].split('=')[1];
                    }
                  }
                  if (res[i].activity_type.includes('Question')) {
                    object.id_question = res[i].activity_info.split(' ')[5].split('=')[1];
                    if (res[i].activity_type.includes('Viewed')) {
                      object.viewed_time = res[i].activity_info.split(' ')[0].replace('[','').replace(']','');
                    } else {
                      object.answered_time = res[i].activity_info.split(' ')[0].replace('[','').replace(']','');
                    }
                  } else {
                    if (res[i].activity_type.includes('Start')) {
                      object.started_time = res[i].activity_info.split(' ')[0].replace('[','').replace(']','');
                    } else {
                      object.ended_time = res[i].activity_info.split(' ')[0].replace('[','').replace(']','');
                    }
                  }
                  $scope.arrayDataSet.push(object)
                }
              }
            }

            let json = JSON.stringify($scope.arrayDataSet);
            let blob = new Blob([json], {type: "application/json"});
            let url  = URL.createObjectURL(blob);
            
            let a = document.createElement('a');
            a.download    = "activity.json";
            a.href        = url;
            a.textContent = "Download activity.json";
            
            document.getElementById('content').appendChild(a);
            a.classList.add("Report_Download");
          }, function(err) {
            toastr.error(err.message, 'Error');
          });
        }
      }

      $scope.run_script = () => {
        console.log($scope.arrayDataSet);
        ReportService
        .process_data($scope.arrayDataSet)
        .then(function(res) {
          console.log(res);
        }, function(err) {
          console.log(err);
        });
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
          else if ($scope.display === 'Activity Log') {
            $scope.generate_activity();
          } 
          else if ($scope.display === 'Quiz') {
            $scope.loading = 1;
            ReportService
            .retrieve_quiz_items($scope.report_data)
            .then(function(res) {
              $scope.over_score = res[0].question_no;
              $scope.num_of_tries = res[0].attempts;
              ReportService
              .retrieve_activity_logs()
              .then(function(res) {
                $scope.activity_log = res;
                if ($scope.display === 'Quiz' && ($scope.report_data.course_selected !== '' || $scope.report_data.questionnaire_selected !== null || $scope.report_data.course_selected === '? string: ?')) {
                  let filtered_quiz = [];
                  let filtered_quiz_start = [];
                  let filtered_quiz_end = [];
                  // Getting the quiz-related logs
                  for(let i=0; i<res.length; i++) {
                    if (res[i].activity_type.includes('Quiz') && res[i].activity_info.includes("questionnaire_id="+$scope.report_data.questionnaire_selected)) {
                      filtered_quiz.push(res[i]);
                      $scope.filtered.quiz.push(res[i]);
                    }
                    if (res[i].activity_type.includes('Quiz Start') && res[i].activity_info.includes("questionnaire_id="+$scope.report_data.questionnaire_selected)) {
                      filtered_quiz_start.push(res[i]);
                      $scope.filtered.quiz_start.push(res[i]);
                    }
                    if (res[i].activity_type.includes('Quiz End') && res[i].activity_info.includes("questionnaire_id="+$scope.report_data.questionnaire_selected)) {
                      filtered_quiz_end.push(res[i]);
                      $scope.filtered.quiz_end.push(res[i]);
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
                  ave_time /= ($scope.course_users.length * $scope.num_of_tries);
                  let average = new Date(ave_time);
                  let seconds = average.getSeconds();
                  let minutes = average.getMinutes();
                  let hour = Math.floor(minutes/60);
                  $scope.average_scores.normal = score_ave.toFixed(2);
                  $scope.average_scores.normal_percentage = ((score_ave / $scope.over_score) * 100).toFixed(2);
                  $scope.final_time = {
                    seconds: seconds+"."+ave_time.toString().substring(0,2),
                    minutes: minutes%60,
                    hour: hour
                  }
                  // End of averaging time (overall) 


                  // For averaging time (highest), getting the Pass/Fail graph and getting the highest average
                  $scope.dateLabels = new Map();
                  let highest_ave = 0;
                  ave_time = 0;
                  for(let i=0; i<$scope.course_users.length; i++) {
                    $scope.high.user_highest.push($scope.course_users[i].user_id);
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
                    $scope.high.user_highest_time.push(ave_time_iteration/highestCount);
                    ave_time = ave_time + (ave_time_iteration/highestCount);
                  };
                  highest_ave /= $scope.course_users.length;
                  ave_time /= $scope.course_users.length;
                  average = new Date(ave_time);
                  seconds = average.getSeconds();
                  minutes = average.getMinutes();
                  hour = Math.floor(minutes/60);
                  $scope.average_scores.highest = highest_ave.toFixed(2);
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

      $scope.get_student_info = () => {
        $scope.get_flag_student = 0;        
        $scope.student.student_id = $('#student_selected').val();
        let scores = [];
        let highest = -999999;
        let index = $scope.high.user_highest.indexOf(parseInt($scope.student.student_id));
        for (let i=0; i<$scope.filtered.quiz_end.length; i++) {
          if($scope.filtered.quiz_end[i].activity_info.split(' ')[2].split('=')[1] === $scope.student.student_id) {
            scores.push($scope.filtered.quiz_end[i]);
            if ($scope.filtered.quiz_end[i].activity_info.split(' ')[5].split('=')[1] > highest) {
              highest = parseInt($scope.filtered.quiz_end[i].activity_info.split(' ')[5].split('=')[1]);
            }
          }
        }
        let ave_time = 0;
        let score_ave = 0;
        for(let i=0; i<scores.length; i++) {
          let referDate = '';
          let date = scores[i].activity_info.split(' ')[0].replace('[','').replace(']','');
          let reference = scores[i].activity_info.split(' ')[7].split('=')[1];
          for(let j=0; j<$scope.filtered.quiz_start.length; j++) {
            if ($scope.filtered.quiz_start[j].activity_id == reference) {
              referDate = $scope.filtered.quiz_start[j].activity_info.split(' ')[0].replace('[','').replace(']','');
              break;
            }
          }
          ave_time = ave_time + (new Date(date) - new Date(referDate));
          score_ave += parseInt(scores[i].activity_info.split(' ')[5].split('=')[1]);
        }
        score_ave /= scores.length;
        ave_time /= ($scope.course_users.length * $scope.num_of_tries);
        let average = new Date(ave_time);
        let seconds = average.getSeconds();
        let minutes = average.getMinutes();
        let hour = Math.floor(minutes/60);
        $scope.student.ave_score = score_ave;
        $scope.student.ave_score_percentage = ((score_ave / $scope.over_score) * 100).toFixed(2);
        $scope.student.ave_time_hours = hour;
        $scope.student.ave_time_minutes = minutes;
        $scope.student.ave_time_seconds = seconds;
        $scope.student.highest_score = highest;        
        $scope.student.highest_score_percentage = ((highest / $scope.over_score) * 100).toFixed(2);
        $scope.get_flag_student = 1;
        let highest_score_ave = $scope.high.user_highest_time[index];
        highest_score_ave /= $scope.course_users.length;
        average = new Date(highest_score_ave);
        seconds = average.getSeconds();
        minutes = average.getMinutes();
        hour = Math.floor(minutes/60);
        $scope.student.highest_ave_time_hours = hour;
        $scope.student.highest_ave_time_minutes = minutes;
        $scope.student.highest_ave_time_seconds = seconds;
      }

      $scope.initialize_graph = (standing, timeTable) => {
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
              labels: timeTable.dateArray,
              xAxisID: "Quiz Time Span",
              yAxisID: "Students' Score",
              datasets: [{
                  label: 'Number of quiz attempts per day',
                  data: timeTable.dataArray,
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
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'number of quiz attempts'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'days quiz is taken'
                }
              }]
            }
          }
        });
      }

		}
})();
