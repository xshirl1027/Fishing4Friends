'use strict';

/**
 * Ratings service used for communicating with the Rating REST endpoints.
 * By default, interacts with REST endpoint 'ratings/:ratingId'
 *
 * @module Ratings
 * @submodule Ratings-Client
 * @class Ratings
 * @constructor
 * @param $resource {Object}
 * @return {Resource} Ratings object
 */
angular.module('ratings').factory('Ratings', ['$resource',
	function($resource) {
		return $resource('ratings/:ratingId', { ratingId: '@_id'
		}, {
			/**
			 * Defines the options for updating a rating document.
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