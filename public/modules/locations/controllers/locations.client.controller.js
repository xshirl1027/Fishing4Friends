'use strict';

// Locations controller
angular.module('locations').controller('LocationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Locations',
	function($scope, $stateParams, $location, Authentication, Locations) {
		$scope.authentication = Authentication;

		// Create new Location
		$scope.create = function() {
			// Create new Location object
			var location = new Locations ({
				name: this.name,
				latitude: this.latitude,
				longitude: this.longitude
			});

			// Redirect after save
			location.$save(function(response) {
				$location.path('locations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Location
		$scope.remove = function(location) {
			if ( location ) { 
				location.$remove();

				for (var i in $scope.locations) {
					if ($scope.locations [i] === location) {
						$scope.locations.splice(i, 1);
					}
				}
			} else {
				$scope.location.$remove(function() {
					$location.path('locations');
				});
			}
		};

		// Update existing Location
		$scope.update = function() {
			var location = $scope.location;

			location.$update(function() {
				$location.path('locations/' + location._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Locations

		// modified to store the locations into the ArrayCoords


		$scope.find = function() {
			var get_lat_long = function(locations) {

				console.log('********', locations);

				var ArrayCoords = new Array([]);

				var NAME = 0;
        		var LATITUDE = 1;
        		var LONGITUDE = 2;

				for (var i=0; i < locations.length; i++) {
					var location = locations[i];

					ArrayCoords[i] = new Array(3);
					ArrayCoords[i][NAME] = location.name;
					ArrayCoords[i][LATITUDE] = location.latitude;
					ArrayCoords[i][LONGITUDE] = location.longitude; 

				}
				console.log(ArrayCoords);
				$scope.arraycoords = ArrayCoords;
				init_map(ArrayCoords);
			};


			$scope.locations = Locations.query(get_lat_long);


		};


	//start map stuff here
    function init_map(arraycoords) {

    	var Toronto_lat = 43.48;
    	var Toronto_long = -79.50;

	    var myCenter = new google.maps.LatLng(Toronto_lat,Toronto_long);

	    var myOptions = {
	      center:myCenter,
	      zoom:5,
	      mapTypeId:google.maps.MapTypeId.ROADMAP
	      };

	    var map = new google.maps.Map(document.getElementById('map'),myOptions);

	    // lowercase arraycoords
	    //                 ArrayCoords[i][0] = location.name;
	    //                 ArrayCoords[i][1] = location.latitude;
	    //                 ArrayCoords[i][2] = location.longitude; 

        var NAME = 0;
        var LATITUDE = 1;
        var LONGITUDE = 2;
        

	    //todo loop over array coords and put markers on the map, with descriptions

	    
	 
	       console.log('%%%%%%%%',arraycoords);
	    
	       for (var i = 0; i < arraycoords.length; i++) {
	       		//write marker to position

	       		if ( (!isNaN(arraycoords[i][LATITUDE])) && (!isNaN(arraycoords[i][LONGITUDE])) ) {

			        var marker_position = new google.maps.LatLng(arraycoords[i][LATITUDE],arraycoords[i][LONGITUDE]);
			        var marker = new google.maps.Marker({position:marker_position,icon: 'modules/locations/img/fishing.png'
			        });
			        marker.setMap(map);

			        //write 'blurb' infowindow over marker.

			        var infowindow = new google.maps.InfoWindow({content:arraycoords[i][NAME]});

		        infowindow.open(map,marker);
		    	}
		    }
	    }

    // end map stuff here

		// Find existing Location
		$scope.findOne = function() {
			$scope.location = Locations.get({ 
				locationId: $stateParams.locationId
			});
		};
	}
]);