'use strict';

(() =>{
	angular
	.module('app')
	.controller('quiz-controller', quiz_controller)
	.directive('onReadFile', read_file)

  quiz_controller.$inject = ['$scope', '$window', '$rootScope','$location'];

	function quiz_controller($scope, $window, $rootScope, $location) {
    $scope.get_questions = {};
    $scope.count = 1;

    $scope.showContent = ($fileContent) => {
      $scope.content = $fileContent;
      
      for (var i = 0; i < $fileContent.length; i++) {
        if (($fileContent[i] == "\n") || (i == ($fileContent.length-1))) {
          $scope.count++;
          console.log($scope.get_questions);
        } else {
          if (!$scope.get_questions[$scope.count])
            $scope.get_questions[$scope.count] = $fileContent[i];
          else
            $scope.get_questions[$scope.count] = $scope.get_questions[$scope.count] + $fileContent[i]; 
        }
      }
		};
	}
	
	function read_file ($parse) {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);
				
				element.on('change', function(onChangeEvent) {
					var reader = new FileReader();
					
					reader.onload = function(onLoadEvent) {
						scope.$apply(function() {
							fn(scope, {$fileContent:onLoadEvent.target.result});
						});
          };
          
          console.log((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
					reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
				});
			}
		};
	};

})();

// Copyright (c) 2015 Alejandro Such Berenguer