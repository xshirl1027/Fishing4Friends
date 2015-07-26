'use strict';

// Messageboards controller
angular.module('messageboards').controller('MessageboardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messageboards',
	function($scope, $stateParams, $location, Authentication, Messageboards) {
		$scope.authentication = Authentication;

		// Create new Messageboard
		$scope.create = function() {
			// Create new Messageboard object
			var messageboard = new Messageboards ({
				name: this.name,
				message: this.message
			});

			// Redirect after save
			messageboard.$save(function(response) {
				$location.path('messageboards/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.message='';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Messageboard
		$scope.remove = function(messageboard) {
			if ( messageboard ) { 
				messageboard.$remove();

				for (var i in $scope.messageboards) {
					if ($scope.messageboards [i] === messageboard) {
						$scope.messageboards.splice(i, 1);
					}
				}
			} else {
				$scope.messageboard.$remove(function() {
					$location.path('messageboards');
				});
			}
		};

		// Update existing Messageboard
		$scope.update = function() {
			var messageboard = $scope.messageboard;

			messageboard.$update(function() {
				$location.path('messageboards/' + messageboard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Messageboards
		$scope.find = function() {
			$scope.messageboards = Messageboards.query();
		};
		
		// Find existing Messageboard
		$scope.findOne = function() {
			console.log($stateParams.messageboardId);
			$scope.messageboard = Messageboards.get({ 
				messageboardId: $stateParams.messageboardId
			});
			//console.log($stateParams.messageboardId);
		};


	}
]);
