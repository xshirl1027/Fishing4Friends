/**
 * Provides the posts module for the Post(Angular).
 *
 * @module Post
 * @submodule Post-Client
 * @main
 */
 
'use strict';
 
/**
 * Controller driving the client views.
 *
 * @class PostController
 * @constructor
 * @param $scope {Object} 
 * @param $stateParams {Object}
 * @param $location {Service}
 * @param Authentication {Service} 
 * @param Post {Resource}
 *
 */
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts',
	function($scope, $stateParams, $location, Authentication, Posts) {
		$scope.authentication = Authentication;
		/** 
		 * Creates a new posts, adding it to the database, and returning it to be displayed in the .../view page.
		 * Parameters for the new posts are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none 
		 * @method create
		 * @return nothing
		 *
		 */
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
		removes the specified posts and directs client back to posts page
		 * @param post
		 * @method remove
		 * @return nothing
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

		/**
		 * Updates the specified post, with new input from the user.
		 * This is used in the .../edit page.
		 * Parameters for the new post are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none
		 * @method update
		 * @return nothing
		 **/
		$scope.update = function() {
			var post = $scope.post;

			post.$update(function() {
				window.history.back();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		/**
		 * returns a list of all existing posts to $scope.offerings.
		 *
		 * @param none
		 * @method find
		 * @return nothing
		**/
		$scope.find = function() {
			$scope.posts = Posts.query();
		};
		/**
		 * return all posts with the messageboardId obtained from $stateParams.
		 *
		 * @param none
		 * @method findOne
		 * @return nothing
		 **/
		$scope.findOne2= function(){
			$scope.posts = Posts.query({'threadid':$stateParams.threadId});
		};
		
		/**
		 * Makes a 'get' to the database, seeking a single post by specified ID.
		 * On successful response from the database, the post objects is assigned to $scope.posts
		 * The posts ID is obtained from $stateParams.
		 *
		 * @param none
		 * @method findOne
		 * @return nothing
		 **/
		$scope.findOne = function() {
			$scope.post = Posts.get({ 
				postId: $stateParams.postId
			});
		};
	}
]);