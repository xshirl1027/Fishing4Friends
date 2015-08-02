'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages',
	function($scope, $stateParams, $location, Authentication, Messages) {
		$scope.authentication = Authentication;
		// Create new Message
		$scope.createreply = function() {
			// Create new Message object
			var message = new Messages ({
				name: this.name,
				receiving: $stateParams.userId,
				sentby: $scope.authentication.user._id
			});

			// Redirect after save
			message.$save(function(response) {
				//$window.location.reload();


			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Create new Message
		$scope.create = function() {
			// Create new Message object

			var message = new Messages ({
				name: this.name,
				receiving: $stateParams.userId,
				sentby: $scope.authentication.user._id
			});

			// Redirect after save
			message.$save(function(response) {
				$location.path('/sent');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		
		// Remove existing Message
		$scope.remove = function(message) {
			if ( message ) { 
				message.$remove();

				for (var i in $scope.messages) {
					if ($scope.messages [i] === message) {
						$scope.messages.splice(i, 1);
					}
				}
			} else {
				$scope.message.$remove(function() {
					$location.path('messages');
				});
			}
		};

		// Update existing Message
		$scope.update = function() {
			var message = $scope.message;

			message.$update(function() {
				$location.path('messages/' + message._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Messages
		$scope.find = function() {
			$scope.messages = Messages.query();
		};
		
		 /**
		 * return all messages sent to the user.
		 *
		 * @param none
		 * @method findOne2
		 * @return nothing
		 **/	
		// Find existing Thread
		$scope.findOne2 = function() {
			//console.log($scope.authentication.user._id);
			$scope.received = Messages.query({'receiving':$scope.authentication.user._id});
			$scope.sent = Messages.query({'sentby':$scope.authentication.user._id});
		};
		$scope.findconvo = function() {
			$scope.sent= Messages.query({'receiving':$stateParams.userId,'sentby':$scope.authentication.user._id});
			$scope.received= Messages.query({'sentby':$stateParams.userId,'receiving':$scope.authentication.user._id});
			
		};
		
		// Find existing Message
		$scope.findOne = function() {
			$scope.message = Messages.get({ 
				messageId: $stateParams.messageId
			});
		};
	}
]);