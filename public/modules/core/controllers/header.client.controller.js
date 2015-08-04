'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'Messages',
	function($scope, Authentication, Menus, Messages) {
		$scope.authentication = Authentication;
		$scope.user = $scope.authentication.user;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
		
		//Get recommended messageBoards and Offerings 
		$scope.countUnreadMsgs = function(){
			if ($scope.user){
				$scope.unreadMsgs = Messages.count();
			}
		};
		
		$scope.clear = function(){
			Messages.clear();
			history.go(0);
		};
	}
]);