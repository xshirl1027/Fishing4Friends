/**
 * Provides the threads module for the Thread (Angular).
 *
 * @module Thread
 * @submodule Client
 * @main
 */
 
'use strict';
 
/**
 * Controller driving the client views.
 *
 * @class ThreadController
 * @constructor
 * @param $scope {Object} 
 * @param $stateParams {Object}
 * @param $location {Service}
 * @param Authentication {Service} 
 * @param Threads {Resource}
 *
 */
angular.module('threads').controller('ThreadsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Threads',
	function($scope, $stateParams, $location, Authentication, Threads) {
		$scope.authentication = Authentication;
		/** 
		 * Creates a new threads, adding it to the database, and returning it to be displayed in the .../view page.
		 * Parameters for the new threads are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none 
		 * @method create
		 * @return nothing
		 *
		 */
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
		
		/**
		removes the specified thread and directs client back to thread page
		 * @param thread
		 * @method remove
		 * @return nothing
		 **/
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
		/**
		 * Updates the specified thread, with new input from the user.
		 * This is used in the .../edit page.
		 * Parameters for the new thread are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none
		 * @method update
		 * @return nothing
		 **/
		// Update existing Thread
		$scope.update = function() {
			var thread = $scope.thread;
			thread.$update(function() {
				$location.path('threads/' + thread._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		/**
		 * returns a list of all existing threads to $scope.offerings.
		 *
		 * @param none
		 * @method find
		 * @return nothing
		**/
		// Find a list of Threads
		$scope.find = function() {
			$scope.threads = Threads.query();
		};
		/**
		 * return all threads with the messageboardId obtained from $stateParams.
		 *
		 * @param none
		 * @method findOne
		 * @return nothing
		 **/	
		// Find existing Thread
		$scope.findOne2 = function() {
			console.log($stateParams.messageboardId);
			$scope.threads = Threads.query({'messageboardId': $stateParams.messageboardId});
		};
		/**
		 * Makes a 'get' to the database, seeking a single threads by specified ID.
		 * On successful response from the database, the threads objects is assigned to $scope.threads
		 * The threads ID is obtained from $stateParams.
		 *
		 * @param none
		 * @method findOne
		 * @return nothing
		 **/	
		// Find existing Thread
		$scope.findOne = function() {
			$scope.thread = Threads.get({ 
				threadId: $stateParams.threadId
			});
		};
	}
]);
