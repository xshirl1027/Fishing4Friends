'use strict';

// Photos controller
angular.module('photos').controller('PhotosController', ['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Photos', 'Users',
	function($scope, $stateParams, $state, $location, Authentication, Photos, Users) {
		$scope.authentication = Authentication;
		// Create new Photo
		$scope.create = function(image) {
			// Create new Photo object
			var photo = new Photos ({
				name: image.file.name,
				src: image.dataURL
			});

			// Redirect after save
			photo.$save(function(response) {
				Users.update({ 'profile_pic' : response._id });
				// Generator default line:
				// $location.path('photos/' + response._id);

				// While the modal window is open, it is the background window that gets redrawn,
				// and still the old pic is shown.
				$state.reload();

				// Clear form fields
				$scope.name = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Photo
		$scope.remove = function(photo) {
			if ( photo ) { 
				photo.$remove();

				for (var i in $scope.photos) {
					if ($scope.photos [i] === photo) {
						$scope.photos.splice(i, 1);
					}
				}
			} else {
				$scope.photo.$remove(function() {
					$location.path('photos');
				});
			}
		};

		// Update existing Photo
		$scope.update = function() {
			var photo = $scope.photo;

			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Photos
		$scope.find = function() {
			$scope.photos = Photos.query();
		};

		// Find existing Photo
		$scope.findOne = function() {
			// NOTE: here is an example of a callback function.
			var callback = function(data) {
				console.log('PhotosController findOne() obtains ', data);
			};
			$scope.photo = Photos.get({ 
				photoId: $stateParams.photoId
			}, callback);
		};

		// Find user's profile photo
		$scope.findUserProfilePic = function() {
			$scope.photo = Photos.get({ 
				photoId: $scope.user.profile_pic
			});
		};

	}
]);
