'use strict';

(function() {
	// Offerings Controller Spec
	describe('Offerings Controller Tests', function() {
		// Initialize global variables
		var OfferingsController,
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

			// Initialize the Offerings controller.
			OfferingsController = $controller('OfferingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Offering object fetched from XHR', inject(function(Offerings) {
			// Create sample Offering using the Offerings service
			var sampleOffering = new Offerings({
				name: 'New Offering'
			});

			// Create a sample Offerings array that includes the new Offering
			var sampleOfferings = [sampleOffering];

			// Set GET response
			$httpBackend.expectGET('offerings').respond(sampleOfferings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.offerings).toEqualData(sampleOfferings);
		}));

		it('$scope.findOne() should create an array with one Offering object fetched from XHR using a offeringId URL parameter', inject(function(Offerings) {
			// Define a sample Offering object
			var sampleOffering = new Offerings({
				name: 'New Offering'
			});

			// Set the URL parameter
			$stateParams.offeringId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/offerings\/([0-9a-fA-F]{24})$/).respond(sampleOffering);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.offering).toEqualData(sampleOffering);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Offerings) {
			// Create a sample Offering object
			var sampleOfferingPostData = new Offerings({
				name: 'New Offering'
			});

			// Create a sample Offering response
			var sampleOfferingResponse = new Offerings({
				_id: '525cf20451979dea2c000001',
				name: 'New Offering'
			});

			// Fixture mock form input values
			scope.name = 'New Offering';

			// Set POST response
			$httpBackend.expectPOST('offerings', sampleOfferingPostData).respond(sampleOfferingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Offering was created
			expect($location.path()).toBe('/offerings/' + sampleOfferingResponse._id);
		}));

		it('$scope.update() should update a valid Offering', inject(function(Offerings) {
			// Define a sample Offering put data
			var sampleOfferingPutData = new Offerings({
				_id: '525cf20451979dea2c000001',
				name: 'New Offering'
			});

			// Mock Offering in scope
			scope.offering = sampleOfferingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/offerings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/offerings/' + sampleOfferingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid offeringId and remove the Offering from the scope', inject(function(Offerings) {
			// Create new Offering object
			var sampleOffering = new Offerings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Offerings array and include the Offering
			scope.offerings = [sampleOffering];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/offerings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOffering);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.offerings.length).toBe(0);
		}));
	});
}());