'use strict';

// Setting up route
angular.module('scrpbks').config(['$stateProvider',
	function($stateProvider) {
		// Scrpbks state routing
		$stateProvider.
		state('listScrpbks', {
			url: '/scrpbks',
			templateUrl: 'modules/scrpbks/views/list-scrpbks.client.view.html'
		}).
		state('createScrpbk', {
			url: '/scrpbks/create',
			templateUrl: 'modules/scrpbks/views/create-scrpbk.client.view.html'
		}).
		state('viewScrpbk', {
			url: '/scrpbks/:scrpbkId',
			templateUrl: 'modules/scrpbks/views/view-scrpbk.client.view.html'
		}).
		state('editScrpbk', {
			url: '/scrpbks/:scrpbkId/edit',
			templateUrl: 'modules/scrpbks/views/edit-scrpbk.client.view.html'
		});
	}
]);