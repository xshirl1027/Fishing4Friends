'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Messageboard = mongoose.model('Messageboard');

/**
 * Globals
 */
var user, messageboard;

/**
 * Unit tests
 */
describe('Messageboard Model Unit Tests:', function() {
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
			messageboard = new Messageboard({
				name: 'Messageboard Name',
				message: 'New Message',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return messageboard.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			messageboard.name = '';

			return messageboard.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Messageboard.remove().exec();
		User.remove().exec();

		done();
	});
});