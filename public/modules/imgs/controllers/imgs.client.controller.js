'use strict';

// imgs controller
angular.module('imgs').controller('ImgsController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Imgs', 'formDataObject', '$modal', 
	function($scope, $stateParams, $http, $location, Authentication, Imgs, formDataObject, $modal) {
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

		$scope.grabImagesUrl = function() {
			$http({
				method: 'POST',
				url: 'imgs/urlImgsCapture',
				data:{
					url: $scope.url
				}
			}).
			then(function(result) {
				var modalInstance = $modal.open({
		            templateUrl: "modules/imgs/views/modals/urlImgsChoose.modal.client.view.html",
		            backdrop: 'static',
		            keyboard: false,
		            size: 'lg',
					resolve: {
		            	items: function() { return result}
		            },
		            controller: 'ImgUrlChooseModalController',
		        });
			    modalInstance.result.then(function (data) {
			    	$http({
						method: 'POST',
						url: 'imgs/downloadImage',
						data:{
							url: data
						}
					}).
					then(function(result) {
			        	var img = new Imgs({
							scrpbk_sel: $scope.img.scrpbk_sel,
							tags: $scope.img.tags,
							uri: JSON.parse(result.data),
							orig_url: $scope.url
						});
			        	img.$save(function(response) {
							$location.path('imgs/' + response._id);
						}, function(errorResponse) {
							$scope.error = errorResponse.data.message;
						});
					});
			    	//console.log(data);
		            //$scope.go('admin.editCampaigns');
		        }, function () {
		            modalInstance.dismiss();
		            //$scope.go('admin.editCampaigns');
		        });				
			});
		};

		$scope.grabURLImage = function() {
			$http({
	            method: 'POST',
	            url: '/imgs/urlCapture',
	            data:{
	            	url: $scope.url
	            }
	            /*data: {
	                url: $scope.file
	            },*/
	            //transformRequest: formDataObject
	        }).
	        then(function(result) {
	        	var img = new Imgs({
					scrpbk_sel: $scope.img.scrpbk_sel,
					tags: $scope.img.tags,
					uri: JSON.parse(result.data),
					orig_url: $scope.url
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
			/*var img = $scope.img;

			img.$update(function() {
				$location.path('imgs/' + img._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});*/
			if($scope.file){
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
		        		_id: img._id,
						scrpbk_sel: $scope.img.scrpbk_sel,
						tags: $scope.img.tags,
						uri: JSON.parse(result.data)
					});
		        	img.$update(function(response) {
						$location.path('imgs/' + response._id);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
		        });
	    	}else{
    			var img = new Imgs({
    				_id: $scope.img._id,
					scrpbk_sel: $scope.img.scrpbk_sel,
					tags: $scope.img.tags,
					uri: $scope.img.uri
				});
	        	img.$update(function(response) {
					$location.path('imgs/' + img._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
	    	}

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
])
.controller('ImgChoiceController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Imgs', 'formDataObject', '$modal', 
	function($scope, $stateParams, $http, $location, Authentication, Imgs, formDataObject, $modal) {
		$scope.authentication = Authentication;

		var item = ['123','hello world'];

		var modalInstance = $modal.open({
            templateUrl: "modules/imgs/views/modals/imgs.capture-choice.modal.client.view.html",
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
			resolve: {
            	items: function() { return item }
            },
            controller: 'ImgChoiceModalController',
        });
	    modalInstance.result.then(function () {
            modalInstance.dismiss();
            //$scope.go('admin.editCampaigns');
        }, function () {
            modalInstance.dismiss();
            //$scope.go('admin.editCampaigns');
        });

	}
]).controller('ImgChoiceModalController', ['$scope','items', '$modalInstance', '$stateParams', '$http', '$location', 'Authentication', 'Imgs', 'formDataObject', '$modal', 

	function($scope,  items, $modalInstance,  $stateParams, $http, $location, Authentication, Imgs, formDataObject, $modal) {

		$scope.dismiss = function() {
			$scope.$dismiss();
		};

		$scope.ok = function (choice) {
            $modalInstance.close(choice);
        };

        $scope.cancel = function () {
           $modalInstance.dismiss('cancel');
        };

	}
]).controller('ImgUrlChooseModalController', ['$scope','items', '$modalInstance', '$stateParams', '$http', '$location', 'Authentication', 'Imgs', 'formDataObject', '$modal', 

	function($scope, items, $modalInstance,  $stateParams, $http, $location, Authentication, Imgs, formDataObject, $modal) {

		$scope.images = items;

		$scope.dismiss = function() {
			$scope.$dismiss();
		};

		$scope.ok = function (choice) {
            $modalInstance.close(choice);
        };

        $scope.cancel = function () {
           $modalInstance.dismiss('cancel');
        };

	}
]);

var toType = function(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};