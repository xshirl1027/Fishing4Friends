'use strict';


/**
 * Photos service used for communicating with the Photo REST endpoints.
 * By default, interacts with REST endpoint 'photos/:photoId'
 *
 * @module Photos
 * @submodule Photos-Client
 * @class Photos
 * @constructor
 * @param $resource {Object}
 * @return {Resource} Photos object
 */
angular.module('photos').factory('Photos', ['$resource',
	function($resource) {
		return $resource('photos/:photoId', { photoId: '@_id'
		}, {
			/**
			 * Defines the options for updating a photo document.
			 *
			 * @property update
			 * @type [options]
			 */
			update: {
				method: 'PUT'
			}
		});
	}
]);