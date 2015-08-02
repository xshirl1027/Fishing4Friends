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

		/******************************************************************
		This set of functions:

		1) gets the array coordinates for the details of the location
		   ie latitude, longitude, the index of the icon picture, and the
		   icon pictures local path.
		2) Draws a map using google maps
		
		3) The user can input and save the locations data using
		   The locations CRUD module, and select a marker icon
		   as well as the text to appear above the icon

		4)  There is a standard marker showing the users supposed position.

		5)  if the user opts out of using position services, or if the browser
		    doesn't support geolocation, the map should have Toronto as the 
		    center

		functions:  

		get_lat_long, init_map, map_markers

		associated views: (views folder)

		create-location.client.view.html
		edit-location.client.view.html
		list-locations.client.view.html
		view-location.client.view.html

		icon images are in the img folder, also located in public/modules/locations
		----------------------------------------------------------------------------------
		known bugs:  (warnings)

		14 warnings " ^ 'google' is not defined. "

		Added the line to get the google libraries to

		layout.server.view in the header.

		(in app/views)

		<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

		There is an option for having a callback after the library is loaded, but that doesn't seem to
		help.

		have tried:   using a loadscript function as in

		www.w3schools.com/googleapi/tryit.asp?filename=tryhtml_map_async

		which should prevent the function from running before the library has loaded, which is
		presumably the source of the warning.  The map renders and works ok, however, even with
		the warning.

		One solution, that would involve rewriting the whole function

		would be to

		do something using the ngmap that can be installed by bower.

		excellent tutorial that I found  (very late on) at

		htttp://rickgao.com/mean-js-ngmaps-crud

		********************************************************************/


		$scope.find = function() {


			function get_lat_long (locations) {

				console.log ('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');

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
			}


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

    	function map_markers (map, center_lat, center_long) {

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


	       //draw the user's position (center lat, center long as a std marker on the map)
	       var marker_position = new google.maps.LatLng(center_lat,center_long);
		   var marker = new google.maps.Marker({position:marker_position});
		   marker.setMap(map);
	    
	       
		   //draw the custom markers on the map.
	       for (var i = 0; i < arraycoords.length; i++) {
	       		//write marker to position

	       		if ( (!isNaN(arraycoords[i][LATITUDE])) && (!isNaN(arraycoords[i][LONGITUDE])) ) {
	       		    

			        marker_position = new google.maps.LatLng(arraycoords[i][LATITUDE],arraycoords[i][LONGITUDE]);
			        marker = new google.maps.Marker({position:marker_position,icon: arraycoords[i][ICON_PATH]
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

    	var Center_lat = 43.7000;    //default latitude for Toronto
    	var Center_long = -79.4000;  //default longitude for Toronto

    	$scope.Center_Latitude = Center_lat;
		$scope.Center_Longitude = Center_long;

 		var local_coords = navigator.geolocation;
		
		function location_function (position) {
			Center_lat = position.coords.latitude;
			Center_long = position.coords.longitude;

			$scope.Center_Latitude = Center_lat;
			$scope.Center_Longitude = Center_long;
			
			var myCenter = new google.maps.LatLng(Center_lat, Center_long);

	    	var myOptions = {
	      		center:myCenter,
	      		zoom:5,
	      		mapTypeId:google.maps.MapTypeId.ROADMAP
	      	};

	  
	    	var map = new google.maps.Map(document.getElementById('map'),myOptions);

	    	map_markers(map, Center_lat, Center_long);

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
		    
			map_markers(map, Center_lat, Center_long);
		}//else
	
		if (called_local_coords === false) {

			var myCenter1 = new google.maps.LatLng(Center_lat, Center_long);

		    var myOptions1 = {
		      center:myCenter1,
		      zoom:5,
		      mapTypeId:google.maps.MapTypeId.ROADMAP
		      };

		    var map1 = new google.maps.Map(document.getElementById('map1'),myOptions1);
		    
			map_markers(map1, Center_lat, Center_long);

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




