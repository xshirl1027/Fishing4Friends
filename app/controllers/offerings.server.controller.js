'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Offering = mongoose.model('Offering'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Offering
 */
exports.create = function(req, res) {
	var offering = new Offering(req.body);
	console.log('POST request body is ',req.body);
	console.log('POST request body.id is ',req.body._id);
	offering.user = req.user;

	offering.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offering);
		}
	});
};

/**
 * Show the current Offering
 */
exports.read = function(req, res) {
	console.log('read route',req.query);
	res.jsonp(req.offering);
};

/**
 * Update a Offering
 */
exports.update = function(req, res) {
	var offering = req.offering ;
	console.log('PUT request body is ',req.body);
	console.log('PUT request body.id is ',req.body._id);
	console.log('req.offering is ',req.offering);

	offering = _.extend(offering , req.body);

	offering.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offering);
		}
	});
};

/**
 * Delete an Offering
 */
exports.delete = function(req, res) {
	var offering = req.offering ;

	offering.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offering);
		}
	});
};

/**
 * List of Offerings and search based on user entered input
 */
exports.list = function(req, res) { 
	var keyNames = Object.keys(req.query);
	var val = req.query[keyNames[0]];
	
	//error handling function
	var offeringsErr = function (err, offerings) {
		if (err) {
			return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		}
		else {
			res.jsonp(offerings);
			//console.log(offerings)
		}
	};
	
	// if no search key is specified, get full list of offerings, since no query is specified
	if (keyNames.length === 0) {
		Offering.find().sort('-created').populate('user', 'displayName').sort('-created').exec(offeringsErr);
	}
	else{
		switch(keyNames[0]){
			case 'price':
			Offering.where('price').lte(val).sort('-created').exec(offeringsErr);
			break;
			
			case 'user':
			Offering.find().where('user').equals(val).populate('interested', 'displayName').sort('-created').exec(offeringsErr);
			break;
			
			case 'rater':
			Offering.find({'rater': val}).populate('user', 'displayName').sort('-created').exec(offeringsErr);
			break;
			
			case 'interested':
			Offering.find({'interested': val}).populate('user', 'displayName').sort('-created').exec(offeringsErr);
			break;
			
			default:
			Offering.find({ $text: { $search: req.query[keyNames[0]] }}).sort('-created').exec(offeringsErr);
			
			
		}
	}
	/*
	// if first key is price, get all offerings with price <= the value in the pair
 	else if ( === 'price'){
 		Offering.where('price').lte(val).sort('-created').exec(offeringsErr);
 	}
	// search the list of offerings with the first key:value pair in the query
	else if (keyNames[0] === 'user') {
		Offering.find().where('user').equals(val).populate('interested', 'displayName').sort('-created').exec(offeringsErr);
	}
	else if (keyNames[0] === 'rater'){
		Offering.find({'rater': val}).populate('user', 'displayName').sort('-created').exec(offeringsErr);
	}
	// otherwise search index 
	else {
		Offering.find({ $text: { $search: req.query[keyNames[0]] }}).sort('-created').exec(offeringsErr);
	}*/
};

/**
 * List of Offerings by this User
 * added by Marc
 */
exports.listByUser = function(req, res) { 
	Offering.find().where('user').equals(req.user).sort('-created').exec(function(err, offerings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offerings);
		}
	});
};

/**
 * Update an Offering to register the user's interest in purchasing it.
 * This function performs the document modification, then saves it to the database and returns
 * the result to the user/client.
 */
exports.addInterested = function(req, res) {
	var offering = req.offering ;
	var userId = req.user._id;

	offering.interested.push(userId);

	offering.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offering);
		}
	});
};

exports.addRating = function(req, res) {
	var offering = req.offering ;
	// The req.body contains the updated offering.
	offering = _.extend(offering, req.body);

	offering.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offering);
		}
	});
};

/**
 * Offering middleware
 */
exports.offeringByID = function(req, res, next, id) { 
	Offering.findById(id).populate({
			path: 'user interested rater',
			select: 'displayName'
		}).populate('rating.comments').populate('offering_pic','src').exec(function(err, offering) {
		   var options = {
		        path: 'rating.comments.user',
		        model: 'User',
		        select: 'displayName'
    		};
		  		User.populate(offering, options, function(err, offering) {
				console.log('offeringByID status is ',req.params);
				if (err) return next(err);
				if (! offering) return next(new Error('Failed to load Offering ' + id));
				req.offering = offering ;
				next();
			});
    });
};

/**
 * Offering authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.offering.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
