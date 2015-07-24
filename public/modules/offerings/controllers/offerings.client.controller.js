'use strict';

// Offerings controller
angular.module('offerings').controller('OfferingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Offerings',
	function($scope, $stateParams, $location, Authentication, Offerings) {
		$scope.authentication = Authentication;

		// Create new Offering
		$scope.create = function() {
			// Create new Offering object
			var offering = new Offerings ({
				name: this.name,
				description: this.description
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

		// Remove existing Offering
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
					$location.path('offerings');
				});
			}
		};

		// Update existing Offering
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
			// var keyNames = Object.keys($scope);
			console.log('$scope.authentication.user._id is ', $scope.authentication.user._id);
			// console.log('$scope is ', $scope);
			var userId = $scope.authentication.user._id;
			var profileId = $scope.$$prevSibling.user._id;
			console.log('$scope is ', $scope);
			$scope.offerings = Offerings.search({ user: profileId });
			if (userId === profileId) {
				console.log('user and profile match');
			}
		};

		// Find existing Offering
		$scope.findOne = function() {
			// var keyNames = Object.keys($stateParams);
			// console.log($stateParams);
			$scope.offering = Offerings.get({ 
				offeringId: $stateParams.offeringId
			});
		};
	}
]);
