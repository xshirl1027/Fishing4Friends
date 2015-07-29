'use strict';

/** Messageboards controller
Client side controller responsible for the creation, deletion and updating of message boards, which is the first layer of the message board interface.
**/
angular.module('messageboards').controller('MessageboardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messageboards',
	function($scope, $stateParams, $location, Authentication, Messageboards) {
		$scope.authentication = Authentication;

		/** $scope.create():
			stores user input for a new message board and saves to database**/
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

		/** $scope.remove():
		iterates through a list of all message board and remove the one you want**/
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

		/** $scope.update():
		Update existing Messageboard**/
		$scope.update = function() {
			var messageboard = $scope.messageboard;

			messageboard.$update(function() {
				$location.path('messageboards/' + messageboard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		/**$scope.find():
		returns a list of all existing message boards
		**/
		$scope.find = function() {
			$scope.messageboards = Messageboards.query();
		};
		
		/** $scope.findOne():
		Return a Message board with the id in the current $stateParams **/
		$scope.findOne = function() {
			$scope.messageboard = Messageboards.get({ 
				messageboardId: $stateParams.messageboardId
			});
		};


	}
]);
