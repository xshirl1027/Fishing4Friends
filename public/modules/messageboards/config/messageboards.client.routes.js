'use strict';

//Setting up route
angular.module('messageboards').config(['$stateProvider',
	function($stateProvider) {
		// Messageboards state routing
		$stateProvider.
		state('listMessageboards', {
			url: '/messageboards',
			templateUrl: 'modules/messageboards/views/list-messageboards.client.view.html'
		}).
		state('createMessageboard', {
			url: '/messageboards/create',
			templateUrl: 'modules/messageboards/views/create-messageboard.client.view.html'
		}).
		state('viewMessageboard', {
			url: '/messageboards/:messageboardId',
			templateUrl: 'modules/messageboards/views/view-messageboard.client.view.html'
		}).
		state('addviewMessageboard', {
			url: '/messageboards/:name/add',
			templateUrl: 'modules/threads/views/create-thread.client.view.html'
		}).
		state('editMessageboard', {
			url: '/messageboards/:messageboardId/edit',
			templateUrl: 'modules/messageboards/views/edit-messageboard.client.view.html'
		});
	}
]);