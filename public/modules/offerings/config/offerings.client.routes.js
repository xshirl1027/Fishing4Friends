'use strict';

//Setting up route
/**
 * Configures the Offerings module.
 * Adds the client routes to the $stateProvider.
 * 
 * @module Offerings
 * @submodule Client
 * @class config
 * @param $stateProvider {Object}
 * @return nothing
 */
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
		state('editOffering', {
			url: '/offerings/:offeringId/edit',
			templateUrl: 'modules/offerings/views/edit-offering.client.view.html'
		});
	}
]);
