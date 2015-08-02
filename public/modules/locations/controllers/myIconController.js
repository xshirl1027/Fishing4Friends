'use strict';
angular.module('locations').controller('IconpicController',['$scope', '$stateParams', '$location', 'Authentication', 'Locations', 
    function($scope, $stateParams, $location, Authentication, Locations) {
                
                console.log ('I am in the ICONPIC CONTROLLER!!');

                console.log ('THE SCOPE FOR THE ICON NUMBER',$scope);

                $scope.current =0;
                
                //$scope.current = $scope.location.icon_number;
                console.log('**************************************');
                console.log($scope.current);
                console.log('**************************************');

                $scope.availableIcons = [
                {
                    src:  'modules/locations/img/0.png'
                },

                {
                    src:  'modules/locations/img/1.png'
                },

                {
                    src:  'modules/locations/img/2.png'
                },
                
                {   
                    src:  'modules/locations/img/3.png'
                },

                {
                    src:  'modules/locations/img/4.png'
                },

                {   
                    src: 'modules/locations/img/5.png'
                },
                
                {
                    src:'modules/locations/img/6.png'
                }];

            
                $scope.max = $scope.availableIcons.length-1;

                //$scope.icon_path = $scope.availableIcons[current].src;
                //console.log($scope.icon_path);

                $scope.increment_icon = function() {

                    $scope.current++;
                    if ($scope.current > ($scope.max)) {
                        $scope.current = 0;
                            
                    }
                    $scope.location.icon_pathname = $scope.availableIcons[$scope.current].src;

                };
                $scope.decrement_icon = function() {
                    $scope.current--;
                    if ($scope.current < 0) {
                        $scope.current = ($scope.max);
                        
                    }
                    $scope.location.icon_pathname = $scope.availableIcons[$scope.current].src;

                    console.log ('I am in the ICONPIC CONTROLLER!!');

                    console.log ('THE SCOPE FOR THE ICON NUMBER',$scope);

                };

    }
]);
