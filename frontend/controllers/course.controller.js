'use strict';

(() => {
	angular
	.module('app')
  .controller('course-controller', course_controller);

  course_controller.$inject = ['$scope', '$window', '$sce', '$timeout', 'CourseService'];

	function course_controller($scope, $window, $sce, $timeout, CourseService) {
    
    $scope.user = new Array();
    $scope.announce = new Array();
    $scope.active = 1;
    $scope.active_option = 1;
    $scope.trust = $sce.trustAsHtml;

    $scope.course_info = {
      course_id: ''
    }
    $scope.course_intro = {}

    $scope.note_info = {
      course_id: '',
      user_id: '',
      post: ''
    }

    $scope.announcements = {}
    
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

    $scope.emptyPrompt = () => {
      toastr.error('Please fill the note field', 'Error');
    }

    $scope.change_active = (data) => {
      $scope.active = data;
      if (data == 1) {
        $('.carousel').carousel('prev')    
      } else {
        $('.carousel').carousel('next')
      }
    }

    $scope.change_option = (data) => {
      $scope.active_option = data;
    }

    $scope.retrieve_course = () => {
      let url = window.location.href
      let res = url.split("/");
      $scope.course_info.course_id = res[res.length-1];
      CourseService
      .retrieve_course($scope.course_info)
      .then(function(res) {
        if (res.length === 0) {
          window.location = '#/error_404';
        } else {
          $scope.course_intro = res[0];
        }
      }, function(err) {
        toastr.error(err.message, 'Error');
      })
    }

    $scope.retrieve_announcement = () => {
      let url = window.location.href
      let res = url.split("/");
      $scope.course_info.course_id = res[res.length-1];
      CourseService
      .retrieve_announcement($scope.course_info)
      .then(function(res) {
        let urls = /(\b(https?|ftp):\/\/[A-Z0-9+&@#\/%?=~_|!:,.;-]*[-A-Z0-9+&@#\/%=~_|])/gim;
        for (let i=0; i<res.length; i++) {
          if (res[i].post.match(urls)) {
            res[i].post = res[i].post.replace(urls, "<a href=\"$1\" target=\"_blank\">$1</a>")
          }
        }
        $scope.announcements = res;
      }, function(err) {
        toastr.error(err.message, 'Error');
      })
    }

    $scope.create_note = (data) => {
      let url = window.location.href
      let res = url.split("/");
      $scope.note_info.course_id = res[res.length-1];
      $scope.note_info.user_id = data.user_id;
      if ($scope.note_info.post.length === 0) {
        toastr.error("Please fill the note field", 'Error');        
      } else {
        CourseService
        .create_note($scope.note_info)
        .then(function(res) {
          toastr.success("Note successfully added!", 'Success');
          $timeout(() => {
            let time = moment().format('ll').split(',')[0];
            let urls = /(\b(https?|ftp):\/\/[A-Z0-9+&@#\/%?=~_|!:,.;-]*[-A-Z0-9+&@#\/%=~_|])/gim;
            if ($scope.note_info.post.match(urls)) {
              $scope.note_info.post = $scope.note_info.post.replace(urls, "<a href=\"$1\" target=\"_blank\">$1</a>")
            }
            let datum = {
              post: $scope.note_info.post,
              firstname: data.firstname,
              lastname: data.lastname,
              time_posted: time
            }
            $scope.announcements.unshift(datum);
            $scope.$apply();
            $scope.note_info.post = '';                   
          }, 100);
        }, function(err) {
          toastr.error(err.message, 'Error');
        })
      }
    }

    $scope.announcements_view = () => {
			CourseService
			.view_announcements()
			.then(function(res) {
        for (let i=0; i < res.length; i++) {
          $scope.announce.push(res[i]);
        }
			}, function(err) {
        toastr.error(err.message, 'Error');
      })
    }

		$scope.questionnaires_view = () => {
			CourseService
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
      $scope.questionnairesData.course_id = window.location.href.split("/")[5];
      $scope.questionnairesData.post = $scope.note_info.post;
      console.log($scope.questionnairesData);
      CourseService
			.add_questionnaires($scope.questionnairesData)
			.then(function(res) {
        let data = {
          questionnaire_id: '',
          questionnaire_name: '',
          questionnaire_desc: '',
          questionnaire_no: ''
        }
        data.questionnaire_id = res.insertId;
        data.questionnaire_name = $scope.questionnairesData.questionnaire_name;
        data.questionnaire_desc = $scope.questionnairesData.questionnaire_desc;
        data.questionnaire_no = $scope.questionnairesData.questionnaire_no;
        toastr.success("The quiz has been added", 'Success');
        $('#addQuestionnaire').modal('hide');
        $scope.user.push(data);
			}, function(err) {
        toastr.error(err.data, 'Error');
			})
    }
    
    $scope.questionnaires_get_info = (data) => {
      $scope.questionnaire_id = data;

			CourseService
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

      CourseService
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
        CourseService
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