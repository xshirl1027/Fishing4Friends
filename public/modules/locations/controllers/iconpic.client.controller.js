'use strict';

angular.module('locations').controller('IconpicController',['$scope', '$stateParams', '$location', 'Authentication', 'Locations',
	function($scope, $stateParams, $location, Authentication, Locations) {
	$scope.authentication = Authentication;
         
               //$scope.path = 'http://imgsv.imaging.nikon.com/lineup/dslr/d800/img/sample01/img_01.png';
               //$scope.path ='modules/locations/img/fishing.png';
                
                $scope.current = 0;

                $scope.availableIcons = [
                {
                    src:  'modules/locations/img/fishing.png'
                },

                {
                    src:  'modules/locations/img/supermarket.png'
                },

                {
                    src:  'modules/locations/img/cabin-2.png'
                },
                
                {   
                    src:  'modules/locations/img/camping-2.png'
                },

                {
                    src:  'modules/locations/img/mall.png'
                },
                
                {
                    src:  'modules/locations/img/fishing.png'
                },

                {   
                    src: 'modules/locations/img/world.png'
                },
                
                {
                    src:'modules/locations/img/assortment.png'
                }];

            

                $scope.increment_icon = function() {
                    $scope.current++;
                    if ($scope.current > ($scope.availableIcons.length -1)) {
                        $scope.current = 0;
                    }
                };
                $scope.decrement_icon = function() {
                    $scope.current--;
                    if ($scope.current < 0) {
                        $scope.current = ($scope.availableIcons.length -1);
                    }
                };

	}
]);