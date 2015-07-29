'use strict';

/**Messageboards service used to communicate Messageboards REST endpoints**/
angular.module('messageboards').factory('Messageboards', ['$resource',
	function($resource) {
		return $resource('messageboards/:messageboardId', { messageboardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);