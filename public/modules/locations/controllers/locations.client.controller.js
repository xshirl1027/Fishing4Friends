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
				longitude: this.longitude,
				icon_number: this.current,
				icon_pathname: this.icon_pathname
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
			
			location.icon_number = $scope.$$childTail.current;
			console.log('###############',$scope);

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
        		var ICON_NUM = 3;
        		var ICON_PATH = 4;

				for (var i=0; i < locations.length; i++) {
					var location = locations[i];

					ArrayCoords[i] = new Array(5);
					ArrayCoords[i][NAME] = location.name;
					ArrayCoords[i][LATITUDE] = location.latitude;
					ArrayCoords[i][LONGITUDE] = location.longitude;
					ArrayCoords[i][ICON_NUM] = location.icon_number; 
					ArrayCoords[i][ICON_PATH] = location.icon_pathname;

				}
				console.log(ArrayCoords);
				$scope.arraycoords = ArrayCoords;

				init_map(ArrayCoords);
			};


			$scope.locations = Locations.query(get_lat_long);


		};



	//start map stuff here
    function init_map(arraycoords) {

    	/**************************************************************
    	purpose:  this function draws a google map
		--------------------------------------------------------------	
		parameters:  arraycoords = an array of all the map information

		See $scope.find() for their definition.
		--------------------------------------------------------------

    	*************************************************************/

    	function map_markers (map) {

    		/**************************************************************
    		purpose:  this function puts the saved map markers on the map
			--------------------------------------------------------------	
			parameters:  map -- the google map object
			--------------------------------------------------------------
			called by init_map function.
    		*************************************************************/

	        var NAME = 0;  // the name that goes on the map marker
	        var LATITUDE = 1; //the lattude of the map marker
	        var LONGITUDE = 2; //the longitude of the map marker
	        var ICON_NUM = 3;  //the index number of the icon marker picture
	        var ICON_PATH = 4; //the path in the filesystem of the marker picture

	 
	       console.log('%%%%%%%%',arraycoords);
	    
	       for (var i = 0; i < arraycoords.length; i++) {
	       		//write marker to position

	       		if ( (!isNaN(arraycoords[i][LATITUDE])) && (!isNaN(arraycoords[i][LONGITUDE])) ) {
	       			

			        var marker_position = new google.maps.LatLng(arraycoords[i][LATITUDE],arraycoords[i][LONGITUDE]);
			        var marker = new google.maps.Marker({position:marker_position,icon: arraycoords[i][ICON_PATH]
			        });
			        marker.setMap(map);

			        //write 'blurb' infowindow over marker.

			        var infowindow = new google.maps.InfoWindow({content:arraycoords[i][NAME]});

		        infowindow.open(map,marker);
		    	}//if
		    }//for
	    }//function map_markers



    	console.log ('IM IN INIT Map');

    	var called_local_coords = false;

    	var Center_lat = 43.48;    //default latitude for Toronto
    	var Center_long = -79.50;  //default longitude for Toronto

 		var local_coords = navigator.geolocation;
		
		function location_function (position) {
			Center_lat = position.coords.latitude;
			Center_long = position.coords.longitude;
			
			var myCenter = new google.maps.LatLng(Center_lat, Center_long);

	    	var myOptions = {
	      		center:myCenter,
	      		zoom:5,
	      		mapTypeId:google.maps.MapTypeId.ROADMAP
	      	};

	  
	    	var map = new google.maps.Map(document.getElementById('map'),myOptions);

	    	map_markers(map);

	    	called_local_coords = true;

		}

		if (local_coords) {

           local_coords.getCurrentPosition(location_function);
		}
		else {

			var myCenter = new google.maps.LatLng(Center_lat, Center_long);

		    var myOptions = {
		      center:myCenter,
		      zoom:5,
		      mapTypeId:google.maps.MapTypeId.ROADMAP
		      };

		    var map = new google.maps.Map(document.getElementById('map'),myOptions);
		    
			map_markers(map);
		}//else
	
		if (called_local_coords === false) {

			var myCenter1 = new google.maps.LatLng(Center_lat, Center_long);

		    var myOptions1 = {
		      center:myCenter1,
		      zoom:5,
		      mapTypeId:google.maps.MapTypeId.ROADMAP
		      };

		    var map1 = new google.maps.Map(document.getElementById('map'),myOptions1);
		    
			map_markers(map1);


		}


	}


    // end map stuff here

		// Find existing Location
		$scope.findOne = function() {
			var assignCurrent = function(location) {
				$scope.current = location.icon_number;	
				console.log('scope in findOne ', $scope);
			};
			$scope.location = Locations.get({ 
				locationId: $stateParams.locationId
			}, assignCurrent);

		};
	}
]);




