/**
 * Provides the Offering Client module (Angular).
 *
 * @module Offerings
 */

'use strict';

/**
 * Controller driving the client views.
 *
 * @class OfferingsController
 * @constructor
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
		 * On sucessful response from the database, the client is redirected to the .../view page.
		 *
		 * @param $scope 
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
		 * On sucessful response from the database, the client is redirected to one page back in the browser's history.
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
		 * On sucessful response from the database, the client is redirected to the .../view page.
		 *
		 * @param $scope
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
		 * On sucessful response from the database, an array of offering objects is assigned to $scope.offerings.
		 *
		 * @param none
		 * @method find
		 * @return nothing
		 */
		$scope.find = function() {
			$scope.offerings = Offerings.query();
		};


		/**
		 * Makes a 'query' to the database, seeking a list of offerings by a specified user's ID.
		 * This is used with the 'ng-init' directive, when loading a user's own profile page.
		 * On sucessful response from the database, an array of offering objects is assigned to $scope.offerings.
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
		 * Makes a 'query' to the database, seeking a list of offerings by a specified user's ID.
		 * This is used with the 'ng-init' directive, when loading another user's profile page.
		 * On sucessful response from the database, an array of offering objects is assigned to $scope.offerings.
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
		// Find a list of Offerings, where user is an authorized rater; added by Bill
		$scope.findByRater = function(){
			var userId = $scope.authentication.user._id;
			$scope.offerings = Offerings.query({ rater: userId });
		};
		
		// Find a list of Offerings, where user is interested; added by Bill
		$scope.findByInterest = function(){
			var userId = $scope.authentication.user._id;
			$scope.offerings = Offerings.query({ interested: userId });
		};
		
		// Find existing Offering, called to load .../view
		$scope.findOne = function() {
			$scope.foundInterested = false;
			$scope.foundRater = false;
			// var keyNames = Object.keys($stateParams);
			// console.log($stateParams);
			console.log('compare with', {_id: $scope.authentication.user._id});
			// var callback = function(juice) {
			// 	console.log('here is the scoop, uh', {_id:$scope.authentication.user._id}._id);
			// 	console.log('here is the scoop, uh', $scope.offering.interested[0]._id);
			// 	// console.log('here is the scoop, uh', $scope.offering.interested.indexOf({_id:$scope.authentication.user._id}));
			//};

			$scope.offering = Offerings.get({ 
				offeringId: $stateParams.offeringId
			}, $scope.compareId);
		};

		// While essentially identical code to the update() function, calling the addInterest()
		// function from the Offerings $resource uses a different RESTful API call.
		$scope.addInterested = function() {
			var offering = $scope.offering;
			$scope.foundInterested = true;

			offering.$addInterested(function() {
				$location.path('offerings/' + offering._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Run as a callback function, it operates on data returned by the server to load the .../view page.
		// It assigns 'true' values to $scope.foundInterested and $scope.foundRater to help determine which
		// action buttons are displayed to the user.
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

			console.log('scope at end of findOne()', $scope);
		};

		// Called in .../view or /user-profile.
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
			// console.log('acceptedBuyer', acceptedBuyer,' the _id', acceptedBuyer[0]._id);
			offering.rater.push(acceptedBuyer[0]._id);

			// console.log('modified offering', offering);

			offering.$update(function() {
				// $location.path('offerings/' + offering._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.addRating = function() {
			// DO NOT calculate updated rating for the offering; save it for 'submit'
			// input particular rating from this user

			// need a route to '/offerings/:offeringId/rating'
			var offering = $scope.offering;
			// offering.rating.
			console.log('scope in addRating is ', $scope);
			console.log('placeholder ', $scope.placeholder);
			console.log('rating score ', $scope.ratingValue);

			offering.$addRating(function() {
				$location.path('offerings/' + offering._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			
		};
		
		// Perform search according to user input
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
		
		//determine order to display offerings
		$scope.changeOrder = function() {
		
			if ($scope.order === 'Descending'){
				$scope.descend = true;
			}
			else{
				$scope.descend = false;
			}
		};		
	}
]).directive('starOffering',
	function() {
		return {
			restrict : 'A',
			template : '<ul class="rating"><li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">\u2605</li></ul>',
			scope : {
				ratingValue : '=',
				max : '=',
				onRatingSelected : '&'
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
				
				scope.toggle = function(index) {
					scope.ratingValue = index + 1;
					scope.onRatingSelected({
						rating : index + 1
					});
				};
				
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
