/**
 * Provides the Locations module for the client (Angular).
 *
 * @module Locations
 * @submodule Locations-Client
 * @main
 */


'use strict';

/**
 * Controller driving the client views.
 *
 * @class LocationsController
 * @constructor
 * @param $scope {Object} 
 * @param $stateParams {Object}
 * @param $location {Service}
 * @param Authentication {Service} 
 * @param Locations{Resource}
 */
angular.module('locations').controller('LocationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Locations',
	function($scope, $stateParams, $location, Authentication, Locations) {
		$scope.authentication = Authentication;

		
		/**
		 * Creates a new location, adding it to the database, and returning it to be displayed in the .../view page.
		 * Parameters for the new offering are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none 
		 * @method create
		 * @return nothing
		 */
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

		/**
		 * Removes the specified  location from the database.
		 * This is used in the .../view page.
		 * On successful response from the database, the client is redirected to one page back in the browser's history.
		 *
		 * @param offering
		 * @method remove
		 * @return nothing
		 */
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

		/**
		 * Updates the specified location with new input from the user.
		 * This is used in the .../edit page.
		 * Parameters for the new offering are indirectly provided by $scope.
		 * On successful response from the database, the client is redirected to the .../view page.
		 *
		 * @param none
		 * @method update
		 * @return nothing
		 */
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

		have tried: using a loadscript function as in

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

		/**
		 * Obtains a full list location documents from the database.
		 * This is used with the 'ng-init' directive.
		 * On successful response from the database, an array of offering objects is assigned to $scope.offerings.
		 *
		 * @param none
		 * @method find
		 * @return nothing
		 */
		$scope.find = function() {


			function get_lat_long (locations) {


			/**
    		purpose:  this function gets the latitudes and longitudes
    		          of all of the saved locations
    		          along with the name, icon_number and the icon_pathname
    		          and the location name, which is the details that appear
    		          above the marker on the map
			--------------------------------------------------------------	
			@param  locations
			@return nothing
			--------------------------------------------------------------
			called by init_map function.
    		*************************************************************/

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


    	/**
    	purpose:  this function draws a google map
		--------------------------------------------------------------	
		@param  arraycoords = an array of all the map information

		See $scope.find() for their definition.
		--------------------------------------------------------------

    	*************************************************************/
	

		function map_markers (map, center_lat, center_long,arraycoords) {
				
				/**
	    		purpose:  this function puts the saved map markers on the map
				--------------------------------------------------------------	
				@param  map -- the google map object
				@param  center_lat -- the latitude of the map center
				@param  center_long -- the longitude of the map center
				@param arraycoords -- the array of loaded map markers data
				--------------------------------------------------------------
				called by init_map function.
	    		*************************************************************/

		        var NAME = 0;  // the name that goes on the map marker
		        var LATITUDE = 1; //the lattude of the map marker
		        var LONGITUDE = 2; //the longitude of the map marker
		        var ICON_NUM = 3;  //the index number of the icon marker picture
		        var ICON_PATH = 4; //the path in the filesystem of the marker picture

		 
		       console.log('%%%%%%%%',arraycoords);
		       
			   //draw the custom markers on the map.
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



		    function draw_center_marker (map, center_lat, center_long) {


		      /**
	    		purpose:  this function puts the center postiton map marker
	    		          on the map
				--------------------------------------------------------------	
				@param  map -- the google map object
				@param  center_lat - the center latitude
				@param  center_long - the center longitude
				--------------------------------------------------------------
				called by init_map function.
	    		*************************************************************/


		     //draw the user's position (center lat, center long as a std marker on the map)

		       var marker_position = new google.maps.LatLng(center_lat,center_long);
			   var marker = new google.maps.Marker({position:marker_position});
			   marker.setMap(map);

			   var latString = center_lat.toString();
			   var longString = center_long.toString();

			   var centerString = latString + ' , ' + longString;

			   console.log (centerString);

			   var infowindow = new google.maps.InfoWindow({content: centerString});

			   infowindow.open(map,marker);

			}

		//init map function continues here


    	console.log ('IM IN INIT Map');

    	var called_local_coords = false;  // false if local_coords callback not used.

    	var Center_lat = 43.7000;    //default latitude for Toronto
    	var Center_long = -79.4000;  //default longitude for Toronto

 		var local_coords = navigator.geolocation;
		
			function location_function (position) {

			/**
	    	purpose:  this function is a callback function that runs
	    	when a user allows their coordinates to be used.

	    	3 way choice:

	    	1)  user opts into map finding location, and the service exists
	    	    in the browser

	    	2)  user doesn't opt into using the location

	    	3)  map service doesn't exist in the browswer

			--------------------------------------------------------------	
			@param  position - returned by the localcoords.getCurrentPosition(location_function) call.
			--------------------------------------------------------------
	    	*************************************************************/
				
				Center_lat = position.coords.latitude;
				Center_long = position.coords.longitude;

				
				var myCenter = new google.maps.LatLng(Center_lat, Center_long);

		    	var myOptions = {
		      		center:myCenter,
		      		zoom:5,
		      		mapTypeId:google.maps.MapTypeId.ROADMAP
		      	};

		  
		    	var map = new google.maps.Map(document.getElementById('map_canvas'),myOptions);

		    	draw_center_marker(map, Center_lat, Center_long);
		    	map_markers(map, Center_lat, Center_long,arraycoords);

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

		    var map = new google.maps.Map(document.getElementById('map_canvas'),myOptions);
		    
		    draw_center_marker(map, Center_lat, Center_long);
			map_markers(map, Center_lat, Center_long,arraycoords);
		}//else
	
		if (called_local_coords === false) {

			var myCenter1 = new google.maps.LatLng(Center_lat, Center_long);

		    var myOptions1 = {
		      center:myCenter1,
		      zoom:5,
		      mapTypeId:google.maps.MapTypeId.ROADMAP
		      };

		    var map1 = new google.maps.Map(document.getElementById('map_canvas'),myOptions1);
		    
		    draw_center_marker(map1, Center_lat, Center_long);
			map_markers(map1, Center_lat, Center_long,arraycoords);

		}

	}


    // end map stuff here

		/**
		 * Makes a 'get' to the database, seeking a single offering by specified ID.
		 * On successful response from the database, the offering objects is assigned to $scope.offering.
		 * The offering ID is obtained from $stateParams.
		 *
		 * @param none
		 * @method findOne
		 * @return nothing
		 */	
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




