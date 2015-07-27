'use strict';

// Offerings controller
angular.module('offerings').controller('OfferingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Offerings',
	function($scope, $stateParams, $location, Authentication, Offerings) {
		$scope.authentication = Authentication;

		$scope.searchOptions = ['Keyword','Price'];
 		$scope.sortOptions = ['Price','Rating','Date'];
 		$scope.searchInfo = {entry: ''};

		// Create new Offering
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

		// Remove existing Offering, called from .../view
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

		// Update existing Offering, called from .../edit
		$scope.update = function() {
			var offering = $scope.offering;
			
			offering.$update(function() {
				$location.path('offerings/' + offering._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Offerings
		$scope.find = function() {
			$scope.offerings = Offerings.query();
		};

		// Find a list of Offerings, searching by user of the loaded profile; added by Marc
		$scope.findByUser = function() {
			var userId = $scope.authentication.user._id;
			var profileId = $scope.$$prevSibling.user._id;

			$scope.offerings = Offerings.search({ user: profileId });
			if (userId === profileId) {
				console.log('user and profile match');
			}
		};
		
		// Find a list of Offerings, where user of the loaded profile is an authorized rater; added by Bill
		$scope.findByRater = function(){
			var userId = $scope.authentication.user._id;
			$scope.offerings = Offerings.query({ rater: userId });
		};
		
		// Find existing Offering, called to load .../view
		$scope.findOne = function() {
			$scope.foundInterested = false;
			$scope.foundRater = false;
			// var keyNames = Object.keys($stateParams);
			// console.log($stateParams);
			console.log('compare with', {_id:$scope.authentication.user._id});
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
]);
