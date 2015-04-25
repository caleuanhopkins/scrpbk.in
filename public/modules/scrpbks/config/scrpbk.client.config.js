'use strict';

// Configuring the Scrpbks module
angular.module('scrpbks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Scrapbooks', 'scrpbks', 'dropdown', '/scrpbks(/create)?');
		Menus.addSubMenuItem('topbar', 'scrpbks', 'List Scrapbooks', 'scrpbks');
		Menus.addSubMenuItem('topbar', 'scrpbks', 'New Scrapbook', 'scrpbks/create');
	}
]);