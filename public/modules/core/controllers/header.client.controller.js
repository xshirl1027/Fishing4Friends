'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'Messages',
	function($scope, Authentication, Menus, Messages) {
		$scope.authentication = Authentication;
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
			console.log('called count function!!');
			var currUser = Authentication.user._id;
			console.log(currUser);
			$scope.unreadMsgs = Messages.count();
		};
		
		$scope.clear = function(){
			Messages.clear();
			javascript:history.go(0);
		};
	}
]);