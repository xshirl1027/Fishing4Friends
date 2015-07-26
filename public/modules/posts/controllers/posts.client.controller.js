'use strict';

// Posts controller
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts',
	function($scope, $stateParams, $location, Authentication, Posts) {
		$scope.authentication = Authentication;

		// Create new Post
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

		// Remove existing Post
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

		// Update existing Post
		$scope.update = function() {
			var post = $scope.post;

			post.$update(function() {
				window.history.back();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Posts
		$scope.find = function() {
			$scope.posts = Posts.query();
		};
		$scope.findOne2= function(){
			$scope.posts = Posts.query({'threadid':$stateParams.threadId});
		};
		// Find existing Post
		
		$scope.findOne = function() {
			$scope.post = Posts.get({ 
				postId: $stateParams.postId
			});
		};
	}
]);