'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('imgs').factory('Imgs', ['$resource',
	function($resource) {
		return $resource('imgs/:imgsId', {
			imgsId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('formDataObject', function() {
	return function(data) {
		var fd = new FormData();
		angular.forEach(data, function(value, key) {
			fd.append(key, value);
		});
		return fd;
	};
}).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);