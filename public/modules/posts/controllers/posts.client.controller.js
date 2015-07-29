'use strict';
/**Client side controller for the post module:
Responsible for user activities on creating, updating, deleting, finding posts
**/
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts',
	function($scope, $stateParams, $location, Authentication, Posts) {
		$scope.authentication = Authentication;

		/**create()
		Create and save new Post**/
		$scope.create = function() {
			// Create new Post object
			var post = new Posts ({
				name: this.name,
				threadid: $stateParams.threadId
			});

			// Redirect after save
			post.$save(function(response) {
				window.history.back();

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		/**
		remove():
		removes existing post
		**/
		$scope.remove = function(post) {
			if ( post ) { 
				post.$remove();

				for (var i in $scope.posts) {
					if ($scope.posts [i] === post) {
						$scope.posts.splice(i, 1);
					}
				}
			} else {
				$scope.post.$remove(function() {
					window.history.back();
				});
			}
		};

		/**update()
		Update existing Post**/
		$scope.update = function() {
			var post = $scope.post;

			post.$update(function() {
				window.history.back();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		/**find(): 
		Find a list of Posts**/
		$scope.find = function() {
			$scope.posts = Posts.query();
		};
		/**findOne2():
		Find a list of posts under the same threadId
		**/
		$scope.findOne2= function(){
			$scope.posts = Posts.query({'threadid':$stateParams.threadId});
		};
		
		/**fineOne():
		Find existing Post by postId
		**/
		$scope.findOne = function() {
			$scope.post = Posts.get({ 
				postId: $stateParams.postId
			});
		};
	}
]);