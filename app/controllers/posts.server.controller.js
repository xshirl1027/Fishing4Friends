'use strict';

/**
 * Server-side Controller for Posts module
	responsible for reading data from and propagating changes to the database
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Post = mongoose.model('Post'),
	_ = require('lodash');

/**create(req, res):
 * Save post and creating user to database
 */
exports.create = function(req, res) {
	var post = new Post(req.body);
	post.user = req.user;

	post.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(post);
		}
	});
};

/**read(req,res):
 * return an existing post from the database
 */
exports.read = function(req, res) {
	res.jsonp(req.post);
};

/**update(req, res):
 * Update a Post and save to database
 */
exports.update = function(req, res) {
	var post = req.post ;

	post = _.extend(post , req.body);

	post.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(post);
		}
	});
};

/**delete(req, res):
 * Delete an Post from the database
 */
exports.delete = function(req, res) {
	var post = req.post ;

	post.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(post);
		}
	});
};

/**list(req, res):
 * Queries the database and return a list of posts
 */
exports.list = function(req, res) { 
var keyNames= Object.keys(req.query);
	if (keyNames.length===0){
		Post.find().sort('-created').populate('user', 'displayName').exec(function(err, posts) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(posts);
			}
		
		});
	}else{
		Post.find().where(keyNames[0]).equals(req.query[keyNames[0]]).sort('created').populate('user', 'displayName').exec(function(err, posts){
			if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			} else {
				res.jsonp(posts);
			}
		});
		
	}
	
};

/**postByID(req, res, next, id):
 * Post middleware
 */
exports.postByID = function(req, res, next, id) { 
	Post.findById(id).populate('user', 'displayName').exec(function(err, post) {
		if (err) return next(err);
		if (! post) return next(new Error('Failed to load Post ' + id));
		req.post = post ;
		next();
	});
};

/**hasAuthorization(req, res, next,):
 * Post authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.post.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
