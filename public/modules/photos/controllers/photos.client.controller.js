/**
 * Provides the Photos module for the client (Angular).
 *
 * @module Photos
 * @submodule Photos-Client
 * @main
 */

'use strict';

/**
 * Controller driving the client views.
 *
 * @class PhotosController
 * @constructor
 * @param $scope {Object} 
 * @param $stateParams {Object}
 * @param $location {Service}
 * @param Authentication {Service} 
 * @param Photos {Resource}
 * @param Users {Resource}
 * @param Offerings {Resource}
 */
angular.module('photos').controller('PhotosController', ['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Photos', 'Users', 'Offerings',
	function($scope, $stateParams, $state, $location, Authentication, Photos, Users, Offerings) {
		$scope.authentication = Authentication;


		/**
		 * Creates a new photo, adds it to the database, and receives a new photo document back from the database.
		 * The photo document ID is then added to either the intended offering or user.
		 * Parameters for the new photo are indirectly provided by $scope.
		 *
		 * @param none 
		 * @method create
		 * @return nothing
		 */
		$scope.create = function(image) {
			// Create new Photo object
			var photo = new Photos ({
				name: image.file.name,
				src: image.dataURL
			});

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

				$scope.photo = response;
				// Clear form fields
				$scope.name = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		/**
		 * Removes the specified photo from the database.
		 * This is used in the .../view page.
		 * On successful response from the database, the client is redirected the photo list.
		 *
		 * @param photo
		 * @method remove
		 * @return nothing
		 */
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


		/**
		 * Updates the specified Photo, with new input from the user.
		 * This is used in the .../edit page.
		 * Parameters for the new Photo are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none
		 * @method update
		 * @return nothing
		 */
		$scope.update = function() {
			var photo = $scope.photo;

			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		/**
		 * Obtains a full list photo documents from the database.
		 * This is used with the 'ng-init' directive.
		 * On successful response from the database, an array of photo objects is assigned to $scope.photos.
		 *
		 * @param none
		 * @method find
		 * @return nothing
		 */
		$scope.find = function() {
			$scope.photos = Photos.query();
		};


		/**
		 * Makes a 'get' request to the database, seeking a single photo by specified ID.
		 * On successful response from the database, the photo object is assigned to $scope.photo.
		 * The photo ID is obtained from $stateParams.
		 *
		 * @param none
		 * @method findOne
		 * @return nothing
		 */	
		$scope.findOne = function() {
			// NOTE: here is an example of a callback function.
			var callback = function(data) {
				// console.log('PhotosController findOne() obtains ', data);
			};
			$scope.photo = Photos.get({ 
				photoId: $stateParams.photoId
			}, callback);
		};


		/**
		 * Makes a 'get' request to the database, seeking the photo by ID referenced in the authenticated user's .profile_pic.
		 * On successful response from the database, the photo object is assigned to $scope.photo.
		 * The user object is obtained from $scope.
		 *
		 * @param none
		 * @method findUserProfilePic
		 * @return nothing
		 */	
		$scope.findUserProfilePic = function() {
			$scope.photo = Photos.get({ 
				photoId: $scope.user.profile_pic
			});
		};

	}
]);
