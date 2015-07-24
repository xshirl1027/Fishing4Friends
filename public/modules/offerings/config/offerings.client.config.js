'use strict';

// Configuring the Articles module
angular.module('offerings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Offerings', 'offerings', 'dropdown', '/offerings(/create)?');
		Menus.addSubMenuItem('topbar', 'offerings', 'List Offerings', 'offerings');
		Menus.addSubMenuItem('topbar', 'offerings', 'New Offering', 'offerings/create');
	}
]);