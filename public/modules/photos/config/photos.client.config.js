'use strict';

/**
 * Configures the Photos module.
 * Can optionally add Photos menu items to the top menu bar.
 * 
 * @module Photos
 * @submodule Photos-Client
 * @class run
 * @param Menus {service}
 * @return nothing
 */
 angular.module('photos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Photos', 'photos', 'dropdown', '/photos(/create)?');
		// Menus.addSubMenuItem('topbar', 'photos', 'List Photos', 'photos');
		// Menus.addSubMenuItem('topbar', 'photos', 'New Photo', 'photos/create');
	}
]);