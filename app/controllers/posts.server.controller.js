'use strict';

/**
 * Providing the Post module for the server
 * @module Post
 * @submodule Server
 * @requires mongoose
 */
 
 /** Server-side Controller for Posts module responsible for reading data from and propagating changes to the database
 *@class ServerController
 *@static
 **/
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Post = mongoose.model('Post'),
	_ = require('lodash');

/**
 * Save post and creator to database
 * @method create
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
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

/**
 * return an existing post to the client
 * @method read
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.read = function(req, res) {
	res.jsonp(req.post);
};

/**
 * Update a Post and save to database and returning update to client
 * @method update
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
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

/**
 * Delete an Post
  * @method delete
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
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

/**
 * Queries the database and return a list of posts
  * @method list
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
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

/**
 * Post middleware\ * 
 * @method postByID
 * @param req {Object} 
 * @param res {Object} 
 * @param next {Function} 
 * @param id {Number} 
 * @return nothing
 **/
exports.postByID = function(req, res, next, id) { 
	Post.findById(id).populate('user', 'displayName').exec(function(err, post) {
		if (err) return next(err);
		if (! post) return next(new Error('Failed to load Post ' + id));
		req.post = post ;
		next();
	});
};

/**
 * Post authorization middleware
 * @method hasAuthorization
 * @param req {Object} 
 * @param res {Object} 
 * @param next {Function} 
 * @return nothing
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.post.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
