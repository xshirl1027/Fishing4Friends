'use strict';

//Setting up route
angular.module('offerings').config(['$stateProvider',
	function($stateProvider) {
		// Offerings state routing
		$stateProvider.
		state('rateOffering', {
			url: '/offerings/:offeringId/rate',
			templateUrl: 'modules/offerings/views/rate.client.view.html'
		}).
		state('listOfferings', {
			url: '/offerings',
			templateUrl: 'modules/offerings/views/list-offerings.client.view.html'
		}).
		state('searchOfferings', {
			url: '/offerings',
			templateUrl: 'modules/offerings/views/list-offerings.client.view.html'
		}).
		state('createOffering', {
			url: '/offerings/create',
			templateUrl: 'modules/offerings/views/create-offering.client.view.html'
		}).
		state('viewOffering', {
			url: '/offerings/:offeringId',
			templateUrl: 'modules/offerings/views/view-offering.client.view.html'
		}).
		// added by Marc, for the user profile page ... seems utterly useless
		state('viewOfferingByUser', {
			url: '/offerings/byUser/1',
			templateUrl: 'modules/offerings/views/view-offering.client.view.html'
		}).
		state('editOffering', {
			url: '/offerings/:offeringId/edit',
			templateUrl: 'modules/offerings/views/edit-offering.client.view.html'
		});
	}
]);
