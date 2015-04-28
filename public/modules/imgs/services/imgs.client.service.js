'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('imgs').factory('Imags', ['$resource',
	function($resource) {
		return $resource('imgs/:imgsId', {
			imgsId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);