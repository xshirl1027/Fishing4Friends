'use strict';

/**
 * Client-side controller for the Thread module responsible for saving changes and retrieving thread data from the database
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Thread = mongoose.model('Thread'),
	_ = require('lodash');

/**create(req, res):
 * Create a Thread and save to database
 */
exports.create = function(req, res) {
	var thread = new Thread(req.body);
	thread.user = req.user;

	thread.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thread);
		}
	});
};

/**read(req, res):
 * return the current thread
 */
exports.read = function(req, res) {
	res.jsonp(req.thread);
};

/**Update(req, res)
 * Update a Thread in the database
 */
exports.update = function(req, res) {
	var thread = req.thread ;

	thread = _.extend(thread , req.body);

	thread.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thread);
		}
	});
};

/**Delete(req, res):
 * Delete a Thread from the database
 */
exports.delete = function(req, res) {
	var thread = req.thread ;

	thread.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thread);
		}
	});
};

/**list(req, res)
 * return query result of of Threads from the database
 return all threads if query is empty
 */
exports.list = function(req, res) { 
	console.log(req.query);
	var keyNames= Object.keys(req.query);
	if (keyNames.length===0){
		Thread.find().sort('-created').populate('user', 'displayName').exec(function(err, threads) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(threads);
			}
		
		});
	}else{
		Thread.find().where(keyNames[0]).equals(req.query[keyNames[0]]).sort('-created').populate('user', 'displayName').exec(function(err, threads){
			if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			} else {
				res.jsonp(threads);
			}
		});
		
	}
	
};



/**threadByID(req, res, next, id):
 * Thread middleware
 */
exports.threadByID = function(req, res, next, id) { 
	Thread.findById(id).populate('user', 'displayName').exec(function(err, thread) {
		if (err) return next(err);
		if (! thread) return next(new Error('Failed to load Thread ' + id));
		req.thread = thread ;
		next();
	});
};


/**hasAuthorization(req, res, next):
 * Thread authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.thread.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
