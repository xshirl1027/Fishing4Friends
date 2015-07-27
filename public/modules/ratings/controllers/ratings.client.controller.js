'use strict';

// Ratings controller
angular.module('ratings').controller('RatingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ratings', 'Offerings',
	function($scope, $stateParams, $location, Authentication, Ratings, Offerings) {
		$scope.authentication = Authentication;

		// Ideal behaviour would be to check whether the user has the priviledge to rate this offering.
		// However, the RatingsController is instantiated before the offering data is available for checking.

		$scope.found = false;


		$scope.checkRaterPriviledge = function () {
			var Id = $location.path().split('/')[2];
			var offering = Offerings.get({
				offeringId: Id
			}, function(juice) {
				console.log('returned offering._id is',juice._id);
				var userId = $scope.authentication.user._id;
				var inArray = false;
				var i = 0;
				while (inArray === false && i < offering.rater.length) {
					if (offering.rater[i]._id === $scope.authentication.user._id) {
						// something
						$scope.found = true;
					}
					i++;
				}
			});
		};

		$scope.checkRaterPriviledge();

		// Create new Rating
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

				// This is the default, but would rather go back to the offering/.../view page. 
				$location.path('ratings/' + response._id);

				// Clear form fields
				$scope.comment = '';
				$scope.rating = -1;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Rating
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

		// Update existing Rating
		$scope.update = function() {
			var rating = $scope.rating;

			rating.$update(function() {
				$location.path('ratings/' + rating._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ratings
		$scope.find = function() {
			$scope.ratings = Ratings.query();
		};

		// Find existing Rating
		$scope.findOne = function() {
			$scope.rating = Ratings.get({ 
				ratingId: $stateParams.ratingId
			});
		};
	}
]).directive('starRating',
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