/**
 * Provides the Messageboard module for the Messageboard (Angular).
 *
 * @module Messageboard
 * @submodule Messageboard-Client
 * @main
 */
 
'use strict';
 
/**
 * Controller driving the client views.
 *
 * @class MessageboardController
 * @constructor
 * @param $scope {Object} 
 * @param $stateParams {Object}
 * @param $location {Service}
 * @param Authentication {Service} 
 * @param Messageboards {Resource}
 *
 */

angular.module('messageboards').controller('MessageboardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messageboards',
	function($scope, $stateParams, $location, Authentication, Messageboards) {
		$scope.authentication = Authentication;

		/** 
		 * Creates a new messageboard, adding it to the database, and returning it to be displayed in the .../view page.
		 * Parameters for the new messageboards are indirectly provided by $scope.
		 * On sucessful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none 
		 * @method create
		 * @return nothing
		 *
		 */
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

		/**
		removes the specified messageboard and directs client back to messageboard page
		 * @param messageboard
		 * @method remove
		 * @return nothing
		 **/
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

		/**
		 * Updates the specified messageboard, with new input from the user.
		 * This is used in the .../edit page.
		 * Parameters for the new messageboard are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none
		 * @method update
		 * @return nothing
		 **/
		$scope.update = function() {
			var messageboard = $scope.messageboard;

			messageboard.$update(function() {
				$location.path('messageboards/' + messageboard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		
		$scope.isadmin=function(){
			if($scope.authentication.user.roles.indexOf('admin')>=0){
				return true;
				
			}else{
				
				return false;
			}
			
		}

		/**
		 * returns a list of all existing messageboards to $scope.messageboard
		 *
		 * @param none
		 * @method find
		 * @return nothing
		**/
		$scope.find = function() {
			$scope.messageboards = Messageboards.query();
		};
		
		/**
		 * Makes a 'get' to the database, seeking a single messageboard by specified ID.
		 * On sucessful response from the database, the messageboard objects is assigned to $scope.messageboard
		 * The Messageboard ID is obtained from $stateParams.
		 *
		 * @param none
		 * @method findOne
		 * @return nothing
		 **/	
		$scope.findOne = function() {
			$scope.messageboard = Messageboards.get({ 
				messageboardId: $stateParams.messageboardId
			});
		};


	}
]);
