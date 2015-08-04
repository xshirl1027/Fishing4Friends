/**
 * Provides the users module for the User (Angular).
 *
 * @module User
 * @submodule Users-Client
 * @main
 */
 
'use strict';
 
/**
 * Controller driving the client views.
 *
 * @class UserController
 * @constructor
 * @param $scope {Object} 
 * @param $stateParams {Object}
 * @param $location {Service}
 * @param Authentication {Service} 
 * @param Users {Resource}
 *
 */
 
angular.module('users').controller('SettingsController', ['$scope', '$stateParams','$http', '$location', 'Users', 'Authentication', 'Offerings', 'Messageboards',
	function($scope, $stateParams, $http, $location, Users, Authentication, Offerings, Messageboards) {
		$scope.user = Authentication.user;
		
		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		/**
		Gets a list of recommended offerings and messageboard topics based on user preference
		 * @param none
		 * @method getRecommendations
		 * @return nothing
		 **/
		$scope.getRecommendations = function(){
			var words = $scope.user.interests;
			$scope.offerings = Offerings.query({ input : words });
			$scope.posts = Messageboards.query({ input : words });
		};
		
		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}
			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};
		
		/**
		Return a user doc based on user ID
		 * @param none
		 * @method findOne
		 * @return nothing
		 **/
		$scope.findOne= function(){
			console.log($stateParams.otherId);
			$scope.other= Users.search({
				otherId:$stateParams.otherId
			},console.log($scope.other));
			
		};
		/**
		Return a list of all existing users
		 * @param none
		 * @method find
		 * @return nothing
		 **/
		$scope.find=function(){
			$scope.users=Users.query();
			$scope.roles=['user','admin'];
		};
		$scope.update = function(user, role) {
			user.roles=role;
			user.$update(function() {
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.checkrole=function(other){
			if (other.roles.indexOf('admin')>=0){
				return true;
			}else{
				return false;
			}
		};
		
		$scope.makeadmin=function(other){
			other.roles.push('admin');
			console.log(other.roles);
			other.$update(function() {
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.removeadmin=function(other){
			var i=other.roles.indexOf('admin');
			other.roles.splice(i,1);
			other.$update(function() {
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);