'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Offering = mongoose.model('Offering'),
	Rating = mongoose.model('Rating'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, credentials2, user, user2, offering, offeringGlobal;

/**
 * Offering routes tests
 */
describe('Offering CRUD tests', function() {
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

		// Save a user to the test db and create new Offering
		user.save(function() {
			offering = {
				name: 'Offering Name',
				description: 'Offering description'
			};

			done();
		});
	});

	it('should be able to save Offering instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Offering
				agent.post('/offerings')
					.send(offering)
					.expect(200)
					.end(function(offeringSaveErr, offeringSaveRes) {
						// Handle Offering save error
						if (offeringSaveErr) done(offeringSaveErr);

						// Get a list of Offerings
						agent.get('/offerings')
							.end(function(offeringsGetErr, offeringsGetRes) {
								// Handle Offering save error
								if (offeringsGetErr) done(offeringsGetErr);

								// Get Offerings list
								var offerings = offeringsGetRes.body;

								// Set assertions
								(offerings[0].user._id).should.equal(userId);
								(offerings[0].name).should.match('Offering Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Offering instance if not logged in', function(done) {
		agent.post('/offerings')
			.send(offering)
			.expect(401)
			.end(function(offeringSaveErr, offeringSaveRes) {
				// Call the assertion callback
				done(offeringSaveErr);
			});
	});

	it('should not be able to save Offering instance if no name is provided', function(done) {
		// Invalidate name field
		offering.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Offering
				agent.post('/offerings')
					.send(offering)
					.expect(400)
					.end(function(offeringSaveErr, offeringSaveRes) {
						// Set message assertion
						(offeringSaveRes.body.message).should.match('Please fill Offering name');
						
						// Handle Offering save error
						done(offeringSaveErr);
					});
			});
	});

	it('should be able to update Offering instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Offering
				agent.post('/offerings')
					.send(offering)
					.expect(200)
					.end(function(offeringSaveErr, offeringSaveRes) {
						// Handle Offering save error
						if (offeringSaveErr) done(offeringSaveErr);

						// Update Offering name
						offering.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Offering
						agent.put('/offerings/' + offeringSaveRes.body._id)
							.send(offering)
							.expect(200)
							.end(function(offeringUpdateErr, offeringUpdateRes) {
								// Handle Offering update error
								if (offeringUpdateErr) done(offeringUpdateErr);

								// Set assertions
								(offeringUpdateRes.body._id).should.equal(offeringSaveRes.body._id);
								(offeringUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Offerings if not signed in', function(done) {
		// Create new Offering model instance
		var offeringObj = new Offering(offering);

		// Save the Offering
		offeringObj.save(function() {
			// Request Offerings
			request(app).get('/offerings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Offering if not signed in', function(done) {
		// Create new Offering model instance
		var offeringObj = new Offering(offering);

		// Save the Offering
		offeringObj.save(function() {
			request(app).get('/offerings/' + offeringObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', offering.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Offering instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Offering
				agent.post('/offerings')
					.send(offering)
					.expect(200)
					.end(function(offeringSaveErr, offeringSaveRes) {
						// Handle Offering save error
						if (offeringSaveErr) done(offeringSaveErr);

						// Delete existing Offering
						agent.delete('/offerings/' + offeringSaveRes.body._id)
							.send(offering)
							.expect(200)
							.end(function(offeringDeleteErr, offeringDeleteRes) {
								// Handle Offering error error
								if (offeringDeleteErr) done(offeringDeleteErr);

								// Set assertions
								(offeringDeleteRes.body._id).should.equal(offeringSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Offering instance if not signed in', function(done) {
		// Set Offering user 
		offering.user = user;

		// Create new Offering model instance
		var offeringObj = new Offering(offering);

		// Save the Offering
		offeringObj.save(function() {
			// Try deleting Offering
			request(app).delete('/offerings/' + offeringObj._id)
			.expect(401)
			.end(function(offeringDeleteErr, offeringDeleteRes) {
				// Set message assertion
				(offeringDeleteRes.body.message).should.match('User is not logged in');

				// Handle Offering error error
				done(offeringDeleteErr);
			});

		});
	});

	it('should not be able to update Offering instance if not signed in', function(done) {
		// Set Offering user 
		offering.user = user;

		// Create new Offering model instance
		var offeringObj = new Offering(offering);

		// Save the Offering
		offeringObj.save(function() {
			// Try deleting Offering
			request(app).put('/offerings/' + offeringObj._id)
			.expect(401)
			.end(function(offeringUpdateErr, offeringUpdateRes) {
				// Set message assertion
				(offeringUpdateRes.body.message).should.match('User is not logged in');

				// Handle Offering error error
				done(offeringUpdateErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Offering.remove().exec();
		done();
	});
});

describe('ADDITIONAL Offering CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		credentials2 = {
			username: 'otherUsername',
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

		// Create another new user
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials2.username,
			password: credentials2.password,
			provider: 'local'
		});

		// Save both users to the test db and create a new Offering in the first user's name
		user.save(function() {

			offeringGlobal = new Offering({
				name: 'Offering Name',
				description: 'My Offering',
				user: user._id
			});

			// Save Offering to the db
			offeringGlobal.save(function() {
				// Save user2 to the test db
				user2.save(function(res) {
					done();
				});
			});
		});
	});

	it('should not be able to delete Offering instance if not its creator', function(done) {
		agent.post('/auth/signin')
			.send(credentials2)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Delete existing Offering
				agent.delete('/offerings/' + offeringGlobal._id)
					.send(offering)
					.expect(403)
					.end(function(offeringDeleteErr, offeringDeleteRes) {
						// Handle Offering error
						if (offeringDeleteErr) done(offeringDeleteErr);

						// Set message assertion
						(offeringDeleteRes.text).should.match('User is not authorized');
						
						// Handle Offering save error
						done(offeringDeleteErr);
					});
			});
	});

	it('should not be able to update Offering instance if not its creator', function(done) {
		agent.post('/auth/signin')
			.send(credentials2)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Delete existing Offering
				agent.put('/offerings/' + offeringGlobal._id)
					.send(offering)
					.expect(403)
					.end(function(offeringDeleteErr, offeringDeleteRes) {
						// Handle Offering error
						if (offeringDeleteErr) done(offeringDeleteErr);

						// Set message assertion
						(offeringDeleteRes.text).should.match('User is not authorized');
						
						// Handle Offering save error
						done(offeringDeleteErr);
					});
			});
	});

	it('should not be able to add userId to interested array if not logged in', function(done) {
		agent.put('/offerings/' + offeringGlobal._id + '/interested')
			.send(offering)
			.expect(401)
			.end(function(offeringSaveErr, offeringSaveRes) {
				// Call the assertion callback
				done(offeringSaveErr);
		});
	});

	it('should add userId to interested array if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials2)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				agent.put('/offerings/' + offeringGlobal._id + '/interested')
					.send(offering)
					.expect(200)
					.end(function(offeringSaveErr, offeringSaveRes) {
				// Call the assertion callback
				done(offeringSaveErr);
			});
		});
	});

	it('should not be able to add a user rating if not logged in', function(done) {
		// create a Rating document and save it to the db
		var rating = new Rating({
			user: user2._id
		});
		rating.save();

		// add the rting document reference to the offering document
		offeringGlobal.rating.comments.push(rating._id);

		agent.put('/offerings/' + offeringGlobal._id + '/rating')
			.send(offeringGlobal)
			.expect(401)
			.end(function(offeringSaveErr, offeringSaveRes) {
				// Call the assertion callback
				done(offeringSaveErr);
		});
	});

	it('should add user rating if logged in', function(done) {
		// create a Rating document and save it to the db
		var rating = new Rating({
			user: user2._id
		});
		rating.save();

		// add the rating document reference to the offering document
		offeringGlobal.rating.comments.push(rating);

		agent.post('/auth/signin')
			.send(credentials2)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				agent.put('/offerings/' + offeringGlobal._id + '/rating')
					.send(offeringGlobal)
					.expect(200)
					.end(function(offeringSaveErr, offeringSaveRes) {

						// assert that rating got saved to the document: matching IDs
						console.log('offeringSaveRes.body is ', offeringSaveRes.body.rating);
						(offeringSaveRes.body.rating.comments[0]).should.match((rating._id).toString());

						// Call the assertion callback
						done(offeringSaveErr);
			});
		});		
	});

	afterEach(function(done) {
		User.remove().exec();
		Offering.remove().exec();
		done();
	});
});