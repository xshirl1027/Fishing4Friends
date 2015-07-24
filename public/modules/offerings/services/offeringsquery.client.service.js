'use strict';

angular.module('offerings').factory('OfferingsQuery', ['$resource',
	function($resource) {
		return $resource('offerings/:verb', { verb:'search', query:'@query'}, 	{
			update: {
				method: 'PUT'
			}, search: {
				method:'GET', 
				params: {action: 'search',
                		 query: '@query'},
                isArray:true
			}
		});
	}
]);


// ****************** working example

// angular.module('offerings').factory('OfferingsQuery', ['$resource',
// 	function($resource) {
// 		return $resource('offerings/:action/:query', { query:'@query'}, 	{
// 			update: {
// 				method: 'PUT'
// 			}, search: {
// 				method:'GET', 
// 				params: {action: 'search',
//                 		 query: '@query'},
//                 isArray:true
// 			}
// 		});
// 	}
// ]);

// ***************** and the paired call
				// $scope.offerings = OfferingsQuery.search({ 
				// 	query: profileId
				// });	
