'use strict';

// Threads controller
angular.module('threads').controller('ThreadsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Threads',
	function($scope, $stateParams, $location, Authentication, Threads) {
		$scope.authentication = Authentication;

		// Create new Thread
		$scope.create = function() {
			
			var thread = new Threads ({
				name: this.name,
				messageboardId: $stateParams.messageboardId,
				message:this.message
			});

			// Redirect after save
			thread.$save(function(response) {
				$location.path('threads/' + thread._id);

				// Clear form fields
				$scope.name = '';
				//$scope.messageboardId='';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Thread
		$scope.remove = function(thread) {
			if ( thread ) { 
				thread.$remove();

				for (var i in $scope.threads) {
					if ($scope.threads [i] === thread) {
						$scope.threads.splice(i, 1);
					}
				}
			} else {
				$scope.thread.$remove(function() {
					window.history.back();
				});
			}
		};

		// Update existing Thread
		$scope.update = function() {
			var thread = $scope.thread;

			thread.$update(function() {
				$location.path('threads/' + thread._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Threads
		$scope.find = function() {
			$scope.threads = Threads.query();
		};
		// Find existing Thread
		$scope.findOne2 = function() {
			console.log($stateParams.messageboardId);
			$scope.threads = Threads.query({'messageboardId': $stateParams.messageboardId});
		};
		// Find existing Thread
		$scope.findOne = function() {
			$scope.thread = Threads.get({ 
				threadId: $stateParams.threadId
			});
		};
	}
]);