/**
 * Provides the Ratings module for the client (Angular).
 *
 * @module Ratings
 * @submodule Ratings-Client
 * @main
 */

'use strict';

/**
 * Controller driving the client views.
 *
 * @class RatingsController
 * @constructor
 * @param $scope {Object} 
 * @param $stateParams {Object}
 * @param $location {Service}
 * @param Authentication {Service} 
 * @param Ratings {Resource}
 * @param Offerings {Resource}
 */
angular.module('ratings').controller('RatingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ratings', 'Offerings',
	function($scope, $stateParams, $location, Authentication, Ratings, Offerings) {
		$scope.authentication = Authentication;

		// Ideal behaviour would be to check whether the user has the priviledge to rate this offering.
		// However, the RatingsController is instantiated before the offering data is available for checking.

		$scope.found = false;


		/**
		 * Checks whether the logged in user has the priviledge of writing a rating for the Offering that they are curently viewing.
		 * The function sets the $scope.found property, which triggers 'ng-show' and 'ng-hide' directives in the view.
		 *
		 * @param none 
		 * @method checkRaterPriviledge
		 * @return nothing
		 */
		$scope.checkRaterPriviledge = function () {
			// Obtain the offering ID from the current page URL.
			var Id = $location.path().split('/')[2];
			// Get a valid Offering object from the database.
			var offering = Offerings.get({
				offeringId: Id
			}, function(checkData) {
				console.log('returned offering._id is',checkData._id);
				// Get currently logged-in user's ID
				var userId = $scope.authentication.user._id;
				var inArray = false;
				var i = 0;
				while (inArray === false && i < offering.rater.length) {
					// Look for logged-in user's ID among the Offering's array of approved raters
					if (offering.rater[i]._id === $scope.authentication.user._id) {
						$scope.found = true;
					}
					i++;
				}
			});
		};

		$scope.checkRaterPriviledge();


		/**
		 * Creates a new Rating, adds it to the database, and receives a new Rating document back from the database.
		 * The Rating document ID is then added to the intended Offering.
		 * The Offering's average score and times_purchased properties are updated.
		 * Parameters for the new Rating are indirectly provided by $scope.
		 *
		 * @param none 
		 * @method create
		 * @return nothing
		 */
		$scope.create = function() {
			// Create new Rating object
			var rating = new Ratings ({
				rating: this.rating,
				comment: this.comment
			});

			var offering = $scope.$$prevSibling.offering;

			// Redirect after save
			rating.$save(function(response) {
				// Push the new rating._id into the comments array
				offering.rating.comments.push(response._id);
				// Weight the current average score for the offering.
				var total_score = offering.rating.times_purchased * offering.rating.score;
				// Calculate and input the new average score.
				offering.rating.score = (total_score + rating.rating) / (offering.rating.times_purchased + 1);
				// Increment the number of times offering has been purchased.
				offering.rating.times_purchased += 1;

				// Send updated offering to the server
				offering.$addRating();

				// Remove this use from the rater array
				console.log('user', $scope.authentication.user._id);
				var found = false;
				var i = 0;
				while (found === false && i < offering.rater.length) {
					if (offering.rater[i]._id === $scope.authentication.user._id) {
						// something
						offering.rater.splice(i,1);
						console.log('user removed from rater array');
						found = true;
					}
					i++;
				}

				// Route back to offering/.../view page. 
				$location.path('offerings/' + offering._id);

				// Clear form fields
				$scope.comment = '';
				$scope.rating = -1;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		/**
		 * Removes the specified Rating from the database.
		 * This is used in the .../view page.
		 * On successful response from the database, the client is redirected the Rating list.
		 *
		 * @param rating
		 * @method remove
		 * @return nothing
		 */
		$scope.remove = function(rating) {
			if ( rating ) { 
				rating.$remove();

				for (var i in $scope.ratings) {
					if ($scope.ratings[i] === rating) {
						$scope.ratings.splice(i, 1);
					}
				}
			} else {
				$scope.rating.$remove(function() {
					$location.path('ratings');
				});
			}
		};


		/**
		 * Updates the specified Rating, with new input from the user.
		 * This is used in the .../edit page.
		 * Parameters for the new Rating are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none
		 * @method update
		 * @return nothing
		 */
		$scope.update = function() {
			var rating = $scope.rating;

			rating.$update(function() {
				$location.path('ratings/' + rating._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		/**
		 * Obtains a full list Rating documents from the database.
		 * This is used with the 'ng-init' directive.
		 * On successful response from the database, an array of Rating objects is assigned to $scope.ratings.
		 *
		 * @param none
		 * @method find
		 * @return nothing
		 */
		$scope.find = function() {
			$scope.ratings = Ratings.query();
		};


		/**
		 * Makes a 'get' request to the database, seeking a single Rating by specified ID.
		 * On successful response from the database, the Rating object is assigned to $scope.rating.
		 * The rating ID is obtained from $stateParams.
		 *
		 * @param none
		 * @method findOne
		 * @return nothing
		 */	
		$scope.findOne = function() {
			$scope.rating = Ratings.get({ 
				ratingId: $stateParams.ratingId
			});
		};
	}
		/**
		 * This directive creates and styles the stars displayed for the Rating star rating system.
		 * It provides an interactive styling and records the user's star rating selection.
		 *
		 * @param none
		 * @method starRating
		 * @return html that renders the stars
		 */	
]).directive('starRating',
	function() {
		return {
			restrict : 'A',
			template : '<ul class="rating"><li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)" STYLE="cursor: pointer">\u2605</li></ul>',
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