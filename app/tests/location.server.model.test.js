'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Location = mongoose.model('Location');

/**
 * Globals
 */
var user, lction;

/**
 * Unit tests
 */
describe('Location Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			lction = new Location({
				name: 'Location Name',
				latitude: '0',
				longitude: '0',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return lction.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			lction.name = '';

			return lction.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without latitude', function(done) { 
			lction.latitude = '';

			return lction.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without longitude', function(done) { 
			lction.longitude = '';

			return lction.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save with icon_number as String', function(done) { 
			lction.icon_number = 'I am a String';

			return lction.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Location.remove().exec();
		User.remove().exec();

		done();
	});
});