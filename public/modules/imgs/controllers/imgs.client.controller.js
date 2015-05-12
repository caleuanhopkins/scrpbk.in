'use strict';

// imgs controller
angular.module('imgs').controller('ImgsController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Imgs', 'formDataObject',
	function($scope, $stateParams, $http, $location, Authentication, Imgs, formDataObject) {
		$scope.authentication = Authentication;

		// Create new img
		$scope.create = function() {
			// Create new img object
			var img = new Imgs({
			});

			$http({
	            method: 'POST',
	            url: '/imgs/',
	            headers: {
	                'Content-Type': undefined
	            },
	            data: {
	                file: $scope.file
	            },
	            transformRequest: formDataObject
	        }).
	        then(function(result) {
	            console.log(result.data._id);
	            $location.path('imgs/' + result.data._id)
	        });

			// Redirect after save
			/*img.$save(function(response) {
				console.log(response);
				//$location.path('imgs/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});*/
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
				imgsId: $stateParams.imgsId
			});
		};
	}
]);