'use strict';

// Setting up route
angular.module('imgs').config(['$stateProvider',
	function($stateProvider) {
		// Scrpbks state routing
		$stateProvider.
		state('listImgs', {
			url: '/imgs',
			templateUrl: 'modules/imgs/views/list-imgs.client.view.html'
		}).
		state('createImg', {
			url: '/imgs/create',
			templateUrl: 'modules/imgs/views/create-imgs.client.view.html'
		}).
		state('viewImgs', {
			url: '/imgs/:imgsId',
			templateUrl: 'modules/imgs/views/view-imgs.client.view.html'
		}).
		state('editImgs', {
			url: '/imgs/:imgsId/edit',
			templateUrl: 'modules/imgs/views/edit-imgs.client.view.html'
		});
	}
]);