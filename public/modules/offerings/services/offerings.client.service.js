'use strict';


/**
 * Offerings service used for communicating with the Offering REST endpoints.
 *
 * @module Offerings
 * @submodule Client
 * @class Offerings
 * @constructor
 * @param $resource {Object}
 * @return {Resource} Offerings object
 */
angular.module('offerings').factory('Offerings', ['$resource',
	function($resource) {
		return $resource('offerings/:offeringId', { offeringId: '@_id'
		}, 	{
			/**
			 * Defines the options for updating an offering document.
			 *
			 * @property update
			 * @type [options]
			 */
			update: {
				method: 'PUT'
			},
			/**
			 * Defines the options for making qualified queries.
			 *
			 * @property search
			 * @type [options]
			 */			 
			search: {
				method: 'GET',
				params: {offeringId: '', user: '@stuff'},
				//@reading input
				// note how to extend the query parameters
				// params: {offeringId: '', user: '@userId', price: '0', keywords:['blue','green']},
				isArray: true
			}, 
			/**
			 * Defines the options for updating an offering document to add a user to the 'interested' array.
			 * Interacts with REST endpoint 'offerings/:offeringId/interested/'
			 *
			 * @property addInterested
			 * @type [options]
			 */
			addInterested: {
				method: 'PUT',
				url: 'offerings/:offeringId/interested/'
			}, 
			/**
			 * Defines the options for updating an offering document to add a rating.
			 * Interacts with REST endpoint 'offerings/:offeringId/rating'
			 *
			 * @property addRating
			 * @type [options]
			 */
			addRating: {
				method: 'PUT',
				params: { offeringId: '@_id'},
				url: 'offerings/:offeringId/rating'
			}
		});
	}
]);
