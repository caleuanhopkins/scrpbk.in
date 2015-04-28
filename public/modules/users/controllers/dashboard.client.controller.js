'use strict';

angular.module('users').controller('DashboardController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

	}
]);