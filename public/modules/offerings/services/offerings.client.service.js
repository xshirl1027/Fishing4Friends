'use strict';

//Offerings service used to communicate Offerings REST endpoints
angular.module('offerings').factory('Offerings', ['$resource',
	function($resource) {
		return $resource('offerings/:offeringId', { offeringId: '@_id'
		}, 	{
			update: {
				method: 'PUT'
			}, search: {
				method: 'GET',
				params: {offeringId: '', user: '@stuff'},
				//@reading input
				// note how to extend the query parameters
				// params: {offeringId: '', user: '@userId', price: '0', keywords:['blue','green']},
				isArray: true
			}, addInterested: {
				method: 'PUT',
				url: 'offerings/:offeringId/interested/'
			}, addRating: {
				method: 'PUT',
				params: { offeringId: '@_id'},
				url: 'offerings/:offeringId/rating'
			}
		});
	}
]);
