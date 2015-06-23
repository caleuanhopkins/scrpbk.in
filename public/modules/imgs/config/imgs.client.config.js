'use strict';

// Configuring the Scrpbks module
angular.module('imgs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Images', 'imgs', 'dropdown', '/imgs(/create)?');
		Menus.addSubMenuItem('topbar', 'imgs', 'Show My Images', 'imgs');
		Menus.addSubMenuItem('topbar', 'imgs', 'New Image', 'imgs/imgType');
	}
]);