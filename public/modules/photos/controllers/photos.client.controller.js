'use strict';

// Photos controller
angular.module('photos').controller('PhotosController', ['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Photos', 'Users', 'Offerings',
	function($scope, $stateParams, $state, $location, Authentication, Photos, Users, Offerings) {
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
				// Two paths lead to this point: from an offering, or from a user
				if ($stateParams.offeringId) {
					// Since the only link to the offering is the $stateParams, we make a new query to the database
					// for a valid offering object.
					var offering = Offerings.get({offeringId:$stateParams.offeringId}, function(){
						offering.offering_pic = response._id;
						offering.$update();
					});

					// !!! DO NOT REDIRECT the $location, as user might have unsaved edits in the form.
				}
				else {
					Users.update({ 'profile_pic' : response._id });

					// !! Perform any page redirects from here.
				}

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
