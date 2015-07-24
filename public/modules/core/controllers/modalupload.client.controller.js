'use strict';

angular.module('core').controller('ModaluploadController', ['$scope', '$modal', '$log', '$stateParams',
	function($scope, $modal, $log, $stateParams) {

		$scope.animationsEnabled = true;

		$scope.open = function (size) {

		    var modalInstance = $modal.open({
		        animation: $scope.animationsEnabled,
		        templateUrl: 'myModalContent.html',
		        controller: 'ModalInstanceCtrl',
		        size: size,
		    });

		};
	}
]);

// angular.module('core').controller('ModalInstanceCtrl', ['$location', function ($scope, $modalInstance, $location, items) {
// angular.module('core').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {
angular.module('core').controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.ok = function () {
  	// finish up by closing the window
        $modalInstance.dismiss('ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel'
        // $modalInstance.dismiss('cancel', function() { $location.path('user-profile');} 
            // ... trying to get the base window to reload and display the new picture.
        );
    };

});


angular.module('core').directive('image', function($q) {

        var URL = window.URL || window.webkitURL;

        var getResizeArea = function () {
            var resizeAreaId = 'fileupload-resize-area';

            var resizeArea = document.getElementById(resizeAreaId);

            if (!resizeArea) {
                resizeArea = document.createElement('canvas');
                resizeArea.id = resizeAreaId;
                resizeArea.style.visibility = 'hidden';
                document.body.appendChild(resizeArea);
            }

            return resizeArea;
        };

        var resizeImage = function (origImage, options) {

            console.log('q from resizeImage is ', $q);

            var maxHeight = options.resizeMaxHeight || 300;
            var maxWidth = options.resizeMaxWidth || 250;
            var quality = options.resizeQuality || 0.7;
            var type = options.resizeType || 'image/jpg';

            var canvas = getResizeArea();

            var height = origImage.height;
            var width = origImage.width;

            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            //draw image on canvas
            var ctx = canvas.getContext('2d');
            ctx.drawImage(origImage, 0, 0, width, height);

            // console.log('scope is ', $scope);

            // get the data from canvas as 70% jpg (or specified type).
            return canvas.toDataURL(type, quality);
        };

        var createImage = function(url, callback) {
            var image = new Image();
            image.onload = function() {
                callback(image);
            };
            image.src = url;
        };

        var fileToDataURL = function (file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
        };


        return {
            restrict: 'A',
            scope: {
                image: '=',
                resizeMaxHeight: '@?',
                resizeMaxWidth: '@?',
                resizeMaxHeightThumb: '@?',
                resizeMaxWidthThumb: '@?',
                resizeQuality: '@?',
                resizeType: '@?',
            },
            link: function postLink(scope, element, attrs, ctrl) {

                var doResizing = function(imageResult, callback) {
                    createImage(imageResult.url, function(image) {
                        var dataURL = resizeImage(image, scope);
                        imageResult.resized = {
                            dataURL: dataURL,
                            type: dataURL.match(/:(.+\/.+);/)[1],
                        };
                        callback(imageResult);
                    });
                };

                var applyScope = function(imageResult) {
                    scope.$apply(function() {
                        //console.log(imageResult);
                        if(attrs.multiple)
                            {scope.image.push(imageResult);}
                        else
                            {scope.image = imageResult; }
                        console.log('scope.image.file.name is', scope.image.file.name);

                    });
                };


                element.bind('change', function (evt) {
                    //when multiple always return an array of images
                    if(attrs.multiple)
                        scope.image = [];

                    var files = evt.target.files;
                    var i = 0;
                    // for(var i = 0; i < files.length; i++) {
                        //create a result object for each file in files
                        var imageResult = {
                            file: files[i],
                            url: URL.createObjectURL(files[i])
                        };

                        fileToDataURL(files[i]).then(function (dataURL) {
                            imageResult.dataURL = dataURL;
                        });

                        if(scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                            doResizing(imageResult, function(imageResult) {
                                applyScope(imageResult);
                            });
                        }
                        else { //no resizing
                            applyScope(imageResult);
                        }
                    // }

                });
            }
        };
    });
