'use strict';

// Configuring the Articles module
angular.module('messageboards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Messageboards', 'messageboards', '/messageboards/create');
	}
]);