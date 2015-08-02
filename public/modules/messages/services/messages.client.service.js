'use strict';

//Messages service used to communicate Messages REST endpoints
angular.module('messages').factory('Messages', ['$resource',
	function($resource) {
		return $resource('messages/:messageId', { messageId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			count: {
				method: 'GET',
				url: 'messages/count'
			},
			clear: {
				method: 'PUT',
				url: 'messages/clear'
			}
		});
	}
]);