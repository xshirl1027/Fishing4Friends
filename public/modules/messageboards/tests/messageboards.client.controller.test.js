'use strict';

(function() {
	// Messageboards Controller Spec
	describe('Messageboards Controller Tests', function() {
		// Initialize global variables
		var MessageboardsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Messageboards controller.
			MessageboardsController = $controller('MessageboardsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Messageboard object fetched from XHR', inject(function(Messageboards) {
			// Create sample Messageboard using the Messageboards service
			var sampleMessageboard = new Messageboards({
				name: 'New Messageboard'
			});

			// Create a sample Messageboards array that includes the new Messageboard
			var sampleMessageboards = [sampleMessageboard];

			// Set GET response
			$httpBackend.expectGET('messageboards').respond(sampleMessageboards);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.messageboards).toEqualData(sampleMessageboards);
		}));

		it('$scope.findOne() should create an array with one Messageboard object fetched from XHR using a messageboardId URL parameter', inject(function(Messageboards) {
			// Define a sample Messageboard object
			var sampleMessageboard = new Messageboards({
				name: 'New Messageboard'
			});

			// Set the URL parameter
			$stateParams.messageboardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/messageboards\/([0-9a-fA-F]{24})$/).respond(sampleMessageboard);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.messageboard).toEqualData(sampleMessageboard);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Messageboards) {
			// Create a sample Messageboard object
			var sampleMessageboardPostData = new Messageboards({
				name: 'New Messageboard'
			});

			// Create a sample Messageboard response
			var sampleMessageboardResponse = new Messageboards({
				_id: '525cf20451979dea2c000001',
				name: 'New Messageboard'
			});

			// Fixture mock form input values
			scope.name = 'New Messageboard';

			// Set POST response
			$httpBackend.expectPOST('messageboards', sampleMessageboardPostData).respond(sampleMessageboardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Messageboard was created
			expect($location.path()).toBe('/messageboards/' + sampleMessageboardResponse._id);
		}));

		it('$scope.update() should update a valid Messageboard', inject(function(Messageboards) {
			// Define a sample Messageboard put data
			var sampleMessageboardPutData = new Messageboards({
				_id: '525cf20451979dea2c000001',
				name: 'New Messageboard'
			});

			// Mock Messageboard in scope
			scope.messageboard = sampleMessageboardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/messageboards\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/messageboards/' + sampleMessageboardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid messageboardId and remove the Messageboard from the scope', inject(function(Messageboards) {
			// Create new Messageboard object
			var sampleMessageboard = new Messageboards({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Messageboards array and include the Messageboard
			scope.messageboards = [sampleMessageboard];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/messageboards\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMessageboard);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.messageboards.length).toBe(0);
		}));
	});
}());