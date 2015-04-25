'use strict';

// Scrpbks controller
angular.module('scrpbks').controller('ScrpbksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Scrpbks',
	function($scope, $stateParams, $location, Authentication, Scrpbks) {
		$scope.authentication = Authentication;

		// Create new Scrpbk
		$scope.create = function() {
			// Create new Scrpbk object
			var scrpbk = new Scrpbks({
				title: this.title,
				content: this.content
			});

			// Redirect after save
			scrpbk.$save(function(response) {
				$location.path('scrpbks/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Scrpbk
		$scope.remove = function(scrpbk) {
			if (scrpbk) {
				scrpbk.$remove();

				for (var i in $scope.scrpbks) {
					if ($scope.scrpbks[i] === scrpbk) {
						$scope.scrpbks.splice(i, 1);
					}
				}
			} else {
				$scope.scrpbk.$remove(function() {
					$location.path('scrpbks');
				});
			}
		};

		// Update existing Scrpbk
		$scope.update = function() {
			var scrpbk = $scope.scrpbk;

			scrpbk.$update(function() {
				$location.path('scrpbks/' + scrpbk._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Scrpbks
		$scope.find = function() {
			$scope.scrpbks = Scrpbks.query();
		};

		// Find existing Scrpbk
		$scope.findOne = function() {
			$scope.scrpbk = Scrpbks.get({
				scrpbkId: $stateParams.scrpbkId
			});
		};
	}
]);