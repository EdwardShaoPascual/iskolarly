'use strict';

(() => {
	angular
		.module('app')
		.factory('landing-service', landing_service);

		landing_service.$inject = ['$window', '$http', '$q'];

		const headers = {
			'content-type': 'application/x-www-form-urlencoded'
		};

		function landing_service($window, $http, $q) {
		
			const user_login = function (data) {
				let deferred = $q.defer();

        $http({
					method: 'POST',
					params: data,
					xhrFields: {withCredentials: true},
					url: '/api/login',
					headers: headers
				})
				.then(function(res) {
					$window.location.href = '/#/user';
					deferred.resolve(res.data);
				}, function(err) {
					deferred.reject(err.data);
				})

				return deferred.promise;
			}

			const sign_up = function (data) {
				let deferred = $q.defer();

				$http({
					method: 'POST',
					params: data,
					xhrFields: {withCredentials: true},
					url: '/api/sign_up',
					headers: headers
				})
				.then(function(res) {
					deferred.resolve(res.data);
				}, function(err) {
					deferred.reject(err.data);
				})

				return deferred.promise;
			}
			
			let service = {};
			service.user_login 				= user_login;
			service.sign_up 				= sign_up;
			return service;

		}
})();