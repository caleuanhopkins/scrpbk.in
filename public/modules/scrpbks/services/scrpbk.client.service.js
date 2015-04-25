'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('scrpbks').factory('Scrpbks', ['$resource',
	function($resource) {
		return $resource('scrpbks/:scrpbkId', {
			scrpbkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);