'use strict';

/**
 * Configures the Offerings module.
 * Adds Offering menu items to the top menu bar.
 * 
 * @module Offerings
 * @submodule Offerings-Client
 * @class run
 * @param Menus {service}
 * @return nothing
 */
angular.module('offerings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Offerings', 'offerings', 'dropdown', '/offerings(/create)?');
		Menus.addSubMenuItem('topbar', 'offerings', 'View Offerings', 'offerings');
		Menus.addSubMenuItem('topbar', 'offerings', 'Make Offering', 'offerings/create');
	}
]);