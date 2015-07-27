'use strict';

// Scrpbks controller
angular.module('scrpbks').controller('ScrpbksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Scrpbks', 'Imgs',
	function($scope, $stateParams, $location, Authentication, Scrpbks, Imgs) {
		$scope.authentication = Authentication;
		$scope.imgs = {}

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

		$scope.findScrpbkImgs = function() {
			//var t = Imgs.query({});
			$scope.scrpbk.$promise.then(function(data){
			    var privateParam = data.private;
				if(privateParam === true){
					$scope.imgs = Imgs.query({
						scrpbk_sel: $stateParams.scrpbkId,
						private: true
					});
				}else{
					$scope.imgs = Imgs.query({
						scrpbk_sel: $stateParams.scrpbkId
					});			
				}
			});
		};

		$scope.findPrevImgs = function(id) {
			//var t = Imgs.query({});
			$scope.scrpbks.$promise.then(function(data){
			    var privateParam = data.private;
				if(privateParam === true){
					$scope.imgs[id] = Imgs.query({
						scrpbk_sel: id,
						sort: -1,
						limit: 1,
						private: true
					});
				}else{
					$scope.imgs[id] = Imgs.query({
						scrpbk_sel: id,
						sort: -1,
						limit: 1
					});			
				}
			});
		};

		// Find a list of Scrpbks
		$scope.find = function() {
			$scope.scrpbks = Scrpbks.query({
				user: $scope.authentication.user._id
			});
		};

		// Find existing Scrpbk
		$scope.findOne = function() {
			$scope.scrpbk = Scrpbks.get({
				scrpbkId: $stateParams.scrpbkId,
				//user: $scope.authentication.user._id
			});
			$scope.scrpbk.$promise.then(function(data){
			    var privateParam = data.private;
				if(privateParam === true && typeof $scope.authentication.user._id == 'undefined'){
					$scope.scrpbk = '';
				}else if(privateParam === true && $scope.authentication.user._id != data.user._id){
					$scope.scrpbk = '';
				}else{
					return true;
				}
			});
		};
	}
]);