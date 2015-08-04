/**
 * Provides the Offerings module for the client (Angular).
 *
 * @module Offerings
 * @submodule Offerings-Client
 * @main
 */

'use strict';

/**
 * Controller driving the client views.
 *
 * @class OfferingsController
 * @constructor
 * @param $scope {Object} 
 * @param $stateParams {Object}
 * @param $location {Service}
 * @param Authentication {Service} 
 * @param Offerings {Resource}
 */
angular.module('offerings').controller('OfferingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Offerings',
	function($scope, $stateParams, $location, Authentication, Offerings) {
		$scope.authentication = Authentication;

		$scope.searchOptions = ['Keyword','Price'];
 		$scope.sortOptions = ['Price','Rating','Date'];
 		$scope.searchInfo = {entry: ''};


		/**
		 * Creates a new offering, adding it to the database, and returning it to be displayed in the .../view page.
		 * Parameters for the new offering are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none 
		 * @method create
		 * @return nothing
		 */
		$scope.create = function() {
			// Create new Offering object
			var offering = new Offerings ({
				name: this.name,
				description: this.description,
				price: this.price,
				interested: []
			});
			console.log(this.description);
			// Redirect after save
			offering.$save(function(response) {
				$location.path('offerings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		/**
		 * Removes the specified offering from the database.
		 * This is used in the .../view page.
		 * On successful response from the database, the client is redirected to one page back in the browser's history.
		 *
		 * @param offering
		 * @method remove
		 * @return nothing
		 */
		$scope.remove = function(offering) {
			if ( offering ) { 
				offering.$remove();

				for (var i in $scope.offerings) {
					if ($scope.offerings [i] === offering) {
						$scope.offerings.splice(i, 1);
					}
				}
			} else {
				$scope.offering.$remove(function() {
					// $location.path('offerings');
					history.back();
				});
			}
		};


		/**
		 * Updates the specified offering, with new input from the user.
		 * This is used in the .../edit page.
		 * Parameters for the new offering are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none
		 * @method update
		 * @return nothing
		 */
		$scope.update = function() {
			var offering = $scope.offering;
			
			offering.$update(function() {
				$location.path('offerings/' + offering._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		/**
		 * Obtains a full list Offering documents from the database.
		 * This is used with the 'ng-init' directive.
		 * On successful response from the database, an array of offering objects is assigned to $scope.offerings.
		 *
		 * @param none
		 * @method find
		 * @return nothing
		 */
		$scope.find = function() {
			$scope.offerings = Offerings.query();
		};


		/**
		 * Makes a 'search' to the database, seeking a list of offerings by a specified user's ID.
		 * This is used with the 'ng-init' directive, when loading a user's own profile page.
		 * On successful response from the database, an array of offering objects is assigned to $scope.offerings.
		 *
		 * @param none
		 * @method findByUser
		 * @return nothing
		 */
		$scope.findByUser = function() {
			var profileId = $scope.$$prevSibling.user._id;

			$scope.offerings = Offerings.search({ user: profileId });

		};


		/**
		 * Makes a 'search' to the database, seeking a list of offerings by a specified user's ID.
		 * This is used with the 'ng-init' directive, when loading another user's profile page.
		 * On successful response from the database, an array of offering objects is assigned to $scope.offerings.
		 *
		 * @param none
		 * @method findByUser
		 * @return nothing
		 */		
		$scope.findByOther = function() {
			//var userId = $scope.authentication.user._id;
			//var profileId = $scope.$$prevSibling.other._id;
			//console.log($stateParams);
			$scope.otherofferings = Offerings.search({ user: $stateParams.otherId });
			
		};


		/**
		 * Makes a 'query' to the database, seeking a list of offerings for which a specified user has rater priviledges.
		 * On successful response from the database, an array of offering objects is assigned to $scope.offerings.
		 *
		 * @param none
		 * @method findByRater
		 * @return nothing
		 */	
		$scope.findByRater = function(){
			var userId = $scope.authentication.user._id;
			$scope.offerings = Offerings.query({ rater: userId });
		};
		

		/**
		 * Makes a 'query' to the database, seeking a list of offerings for which a specified user has shown interest.
		 * On successful response from the database, an array of offering objects is assigned to $scope.offerings.
		 *
		 * @param none
		 * @method findByInterest
		 * @return nothing
		 */	
		$scope.findByInterest = function(){
			var userId = $scope.authentication.user._id;
			$scope.offerings = Offerings.query({ interested: userId });
		};

		
		/**
		 * Makes a 'get' to the database, seeking a single offering by specified ID.
		 * On successful response from the database, the offering objects is assigned to $scope.offering.
		 * The offering ID is obtained from $stateParams.
		 *
		 * @param none
		 * @method findOne
		 * @return nothing
		 */	
		$scope.findOne = function() {
			$scope.foundInterested = false;
			$scope.foundRater = false;

			$scope.offering = Offerings.get({ 
				offeringId: $stateParams.offeringId
			}, $scope.compareId);
		};


		// While essentially identical code to the update() function, calling the addInterest()
		// function from the Offerings $resource uses a different RESTful API call.
		/**
		 * Adds the user to the offering's 'interested' array. This uses a custom route to trigger the server to modify the document.
		 * On successful response from the database, the client is directed to the .../view page.
		 *
		 * @param none
		 * @method addInterested
		 * @return nothing
		 */	
		$scope.addInterested = function() {
			var offering = $scope.offering;
			$scope.foundInterested = true;

			offering.$addInterested(function() {
				$location.path('offerings/' + offering._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		/**
		 * Run as a callback function, it operates on data returned by the server to load the .../view page.
		 * It assigns 'true' to either $scope.foundInterested or $scope.foundRater (or neither) to help determine which action buttons are displayed to the user.
		 *
		 * @param offering
		 * @method compareId
		 * @return nothing
		 */			
		$scope.compareId = function(offering) {
			var i = 0;
			while ($scope.foundInterested === false && i < offering.interested.length) {
				if (offering.interested[i]._id === {_id:$scope.authentication.user._id}._id) {
					$scope.foundInterested = true;
				}
				i++;
			}
			while ($scope.foundRater === false && i < offering.rater.length) {
				if (offering.rater[i]._id === {_id:$scope.authentication.user._id}._id) {
					$scope.foundRater = true;
				}
				i++;
			}
		};


		/**
		 * Runs when an offering owner accepts the interest shown by another user, signifying the closure of a transaction.
		 * The function removes the accepted user from the offering's 'interested' array, and adds them to the offering's 'rater' array.
		 *
		 * @param index, offeringId
		 * @method acceptOffer
		 * @return nothing
		 */
		$scope.acceptOffer = function(index, offeringId) {
			var offering;
			if (!offeringId) {
				offering = $scope.offering;
			}
			else {
				offering = offeringId;
			}

			// Accept the user: remove their Id from the offering.interested, and add their Id to the offering.rater
			var acceptedBuyer = offering.interested.splice(index, 1);
			offering.rater.push(acceptedBuyer[0]._id);

			offering.$update(function() {
				// $location.path('offerings/' + offering._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		/**
		 * Performs an 'update' of the offering document, which has been modified with the addition of the reference to anew rating document.
		 * On successful response from the database, the client is directed to the .../view page.
		 *
		 * @param none
		 * @method addRating
		 * @return nothing
		 */
		$scope.addRating = function() {

			var offering = $scope.offering;

			offering.$addRating(function() {
				$location.path('offerings/' + offering._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			
		};
		

		/**
		 * Makes a 'query' to the database, having two options: keyword search or price search.
		 * On successful response from the database, the client is directed to the .../view page.
		 * The query terms are indirectly provided through $scope.searchCriteria and $scope.searchInfo.entry.
		 *
		 * @param none
		 * @method Search
		 * @return nothing
		 */
		$scope.Search = function(){
			var Info = $scope.searchInfo.entry;
			
			switch ($scope.searchCriteria){
				case 'Keyword':
				$scope.offerings = Offerings.query({ input: Info });
				break;
				
				case 'Price':
				$scope.offerings = Offerings.query({ price : Info });
				break;
			}
		};
		

		/**
		 * Operates with user selection of ordering function for the offerings listing.
		 * It will sort according to attribute: price; rating score; or date created.
		 * It will cause the page to reorder the list of offerings.
		 *
		 * @param none
		 * @method changeSort
		 * @return nothing
		 */
		//determine field to sort offerings by
		$scope.changeSort = function() {
			switch($scope.sortCriteria){
				case 'Price': $scope.sorting = 'price';
				break;
				
				case 'Rating': $scope.sorting = 'rating.score';
				break;
				
				default: $scope.sorting = 'created';
			}
		};
		

		/**
		 * Operates with user selection of ordering function for the offerings listing.
		 * It will sort according to order, descending or ascending, by the attribute selected with changeSort().
		 * It will cause the page to reorder the list of offerings.
		 *
		 * @param none
		 * @method changeOrder
		 * @return nothing
		 */
		$scope.changeOrder = function() {
		
			if ($scope.order === 'Descending'){
				$scope.descend = true;
			}
			else{
				$scope.descend = false;
			}
		};		
	}
		/**
		 * This directive creates and styles the stars displayed for the Offering star rating system.
		 *
		 * @param none
		 * @method starOffering
		 * @return html that renders the stars
		 */
]).directive('starOffering',
	function() {
		return {
			restrict : 'A',
			template : '<ul class="rating"><li ng-repeat="star in stars" ng-class="star">\u2605</li></ul>',
			scope : {
				ratingValue : '=',
				max : '=',
				//onRatingSelected : '&'
			},
			link : function(scope, elem, attrs) {
				
				var updateStars = function() {
					scope.stars = [];
					for ( var i = 0; i < scope.max; i++) {
						scope.stars.push({
							filled : i < scope.ratingValue
						});
					}
				};
				
				/*scope.toggle = function(index) {
					scope.ratingValue = index + 1;
					scope.onRatingSelected({
						rating : index + 1
					});
				};*/
				
				scope.$watch('ratingValue',
					function(oldVal, newVal) {
						if (newVal) {
							updateStars();
						}
					}
				);
			}
		};
	}
);
