'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Messageboard = mongoose.model('Messageboard'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, messageboard;

/**
 * Messageboard routes tests
 */
describe('Messageboard CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Messageboard
		user.save(function() {
			messageboard = {
				name: 'Messageboard Name'
			};

			done();
		});
	});

	it('should be able to save Messageboard instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Messageboard
				agent.post('/messageboards')
					.send(messageboard)
					.expect(200)
					.end(function(messageboardSaveErr, messageboardSaveRes) {
						// Handle Messageboard save error
						if (messageboardSaveErr) done(messageboardSaveErr);

						// Get a list of Messageboards
						agent.get('/messageboards')
							.end(function(messageboardsGetErr, messageboardsGetRes) {
								// Handle Messageboard save error
								if (messageboardsGetErr) done(messageboardsGetErr);

								// Get Messageboards list
								var messageboards = messageboardsGetRes.body;

								// Set assertions
								(messageboards[0].user._id).should.equal(userId);
								(messageboards[0].name).should.match('Messageboard Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Messageboard instance if not logged in', function(done) {
		agent.post('/messageboards')
			.send(messageboard)
			.expect(401)
			.end(function(messageboardSaveErr, messageboardSaveRes) {
				// Call the assertion callback
				done(messageboardSaveErr);
			});
	});

	it('should not be able to save Messageboard instance if no name is provided', function(done) {
		// Invalidate name field
		messageboard.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Messageboard
				agent.post('/messageboards')
					.send(messageboard)
					.expect(400)
					.end(function(messageboardSaveErr, messageboardSaveRes) {
						// Set message assertion
						(messageboardSaveRes.body.message).should.match('Please fill Messageboard name');
						
						// Handle Messageboard save error
						done(messageboardSaveErr);
					});
			});
	});

	it('should be able to update Messageboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Messageboard
				agent.post('/messageboards')
					.send(messageboard)
					.expect(200)
					.end(function(messageboardSaveErr, messageboardSaveRes) {
						// Handle Messageboard save error
						if (messageboardSaveErr) done(messageboardSaveErr);

						// Update Messageboard name
						messageboard.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Messageboard
						agent.put('/messageboards/' + messageboardSaveRes.body._id)
							.send(messageboard)
							.expect(200)
							.end(function(messageboardUpdateErr, messageboardUpdateRes) {
								// Handle Messageboard update error
								if (messageboardUpdateErr) done(messageboardUpdateErr);

								// Set assertions
								(messageboardUpdateRes.body._id).should.equal(messageboardSaveRes.body._id);
								(messageboardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Messageboards if not signed in', function(done) {
		// Create new Messageboard model instance
		var messageboardObj = new Messageboard(messageboard);

		// Save the Messageboard
		messageboardObj.save(function() {
			// Request Messageboards
			request(app).get('/messageboards')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Messageboard if not signed in', function(done) {
		// Create new Messageboard model instance
		var messageboardObj = new Messageboard(messageboard);

		// Save the Messageboard
		messageboardObj.save(function() {
			request(app).get('/messageboards/' + messageboardObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', messageboard.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Messageboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Messageboard
				agent.post('/messageboards')
					.send(messageboard)
					.expect(200)
					.end(function(messageboardSaveErr, messageboardSaveRes) {
						// Handle Messageboard save error
						if (messageboardSaveErr) done(messageboardSaveErr);

						// Delete existing Messageboard
						agent.delete('/messageboards/' + messageboardSaveRes.body._id)
							.send(messageboard)
							.expect(200)
							.end(function(messageboardDeleteErr, messageboardDeleteRes) {
								// Handle Messageboard error error
								if (messageboardDeleteErr) done(messageboardDeleteErr);

								// Set assertions
								(messageboardDeleteRes.body._id).should.equal(messageboardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Messageboard instance if not signed in', function(done) {
		// Set Messageboard user 
		messageboard.user = user;

		// Create new Messageboard model instance
		var messageboardObj = new Messageboard(messageboard);

		// Save the Messageboard
		messageboardObj.save(function() {
			// Try deleting Messageboard
			request(app).delete('/messageboards/' + messageboardObj._id)
			.expect(401)
			.end(function(messageboardDeleteErr, messageboardDeleteRes) {
				// Set message assertion
				(messageboardDeleteRes.body.message).should.match('User is not logged in');

				// Handle Messageboard error error
				done(messageboardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Messageboard.remove().exec();
		done();
	});
});