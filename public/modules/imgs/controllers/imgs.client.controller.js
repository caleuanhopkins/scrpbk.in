'use strict';

// imgs controller
angular.module('imgs').controller('ImgsController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Imgs', 'formDataObject',
	function($scope, $stateParams, $http, $location, Authentication, Imgs, formDataObject) {
		$scope.authentication = Authentication;

		$scope.img = { scrpbk_sel: '', tags:[]};

		// Create new img
		$scope.create = function() {
			// Create new img object
			$http({
	            method: 'POST',
	            url: '/imgs/upload',
	            headers: {
	                'Content-Type': undefined
	            },
	            data: {
	                file: $scope.file
	            },
	            transformRequest: formDataObject
	        }).
	        then(function(result) {
	        	var img = new Imgs({
					scrpbk_sel: $scope.img.scrpbk_sel,
					tags: $scope.img.tags,
					uri: JSON.parse(result.data)
				});
	        	img.$save(function(response) {
					$location.path('imgs/' + response._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
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

		$scope.findScrpbk = function() {
			$scope.imgs = Imgs.query({
				scprbk_sel: $stateParams.scrpbkId
			});
		};

		// Find a list of imgs
		$scope.find = function() {
			$scope.imgs = Imgs.query({
				user: $scope.authentication.user._id
			});
		};

		// Find existing img
		$scope.findOne = function() {
			$scope.img = Imgs.get({
				imgsId: $stateParams.imgsId,
				user: $scope.authentication.user._id
			});
		};
	}
]);

var toType = function(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}