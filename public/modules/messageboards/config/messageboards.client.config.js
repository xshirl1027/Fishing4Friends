'use strict';

// Configuring the Articles module
angular.module('messageboards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Messageboards', 'messageboards', 'dropdown', '/messageboards(/create)?');
		Menus.addSubMenuItem('topbar', 'messageboards', 'List Messageboards', 'messageboards');
		Menus.addSubMenuItem('topbar', 'messageboards', 'New Messageboard', 'messageboards/create');
	}
]);