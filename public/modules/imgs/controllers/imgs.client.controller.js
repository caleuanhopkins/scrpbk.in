'use strict';

// imgs controller
angular.module('imgs').controller('ImgsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Imgs',
	function($scope, $stateParams, $location, Authentication, Imgs) {
		$scope.authentication = Authentication;

		// Create new img
		$scope.create = function() {
			// Create new img object
			var img = new Imgs{
				title: this.title,
				content: this.content
			});

			// Redirect after save
			img.$save(function(response) {
				$location.path('imgs/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing img
		$scope.remove = function(img) {
			if (img) {
				img.$remove();

				for (var i in $scope.imgs) {
					if ($scope.imgs[i] === img) {
						$scope.imgs.splice(i, 1);
					}
				}
			} else {
				$scope.img.$remove(function() {
					$location.path('imgs');
				});
			}
		};

		// Update existing img
		$scope.update = function() {
			var img = $scope.img;

			img.$update(function() {
				$location.path('imgs/' + img._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of imgs
		$scope.find = function() {
			$scope.imgs = Imgs.query();
		};

		// Find existing img
		$scope.findOne = function() {
			$scope.img = Imgs.get({
				imgId: $stateParams.imgId
			});
		};
	}
]);