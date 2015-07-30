'use strict';

/**
 Server-side controller for the Thread module responsible for saving changes and retrieving thread data from the database
 @module Thread
 @submodule server
 @require mongoose
 **/
 /**
 * Controller handling the server requests for Thread
 *
  @class ServerController
 * @static
 **/
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Thread = mongoose.model('Thread'),
	_ = require('lodash');

		/**
		 * Saves the newly created thread to the database and returning it to the client
		 * @param req{object}
		   @param res{object}
		 * @method create
		 * @return nothing
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

/**Sends the current thread back to the client controller
		 * @param req{object}
		 * @param res{object}
		 * @method read
		 * @return nothing
 */
exports.read = function(req, res) {
	res.jsonp(req.thread);
};

/**
 * Update a Thread in the database
 		 * @param req{object}
		   @param res{object}
		 * @method update
		 * @return nothing
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

/**
 * Delete a Thread from the database
 		 * @param req{object}
		   @param res{object}
		 * @method delete
		 * @return nothing
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

/**
 * sends a query result of Threads to the client or send a list of all threads if client did not provide a query
 		 * @param req{object}
		   @param res{object}
		 * @method list
		 * @return nothing
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



/**
 * Thread middleware
 		 * @param req{object}
		   @param res{object}
		   @param id{string}
		   @param next{function}
		 * @method threadByID
		 * @return nothing
 */
exports.threadByID = function(req, res, next, id) { 
	Thread.findById(id).populate('user', 'displayName').exec(function(err, thread) {
		if (err) return next(err);
		if (! thread) return next(new Error('Failed to load Thread ' + id));
		req.thread = thread ;
		next();
	});
};


/**
 * Thread authorization middleware
 		 * @param req{object}
		   @param res{object}
		   @param next{function}
		 * @method hasAuthorization
		 * @return nothing
 **/
exports.hasAuthorization = function(req, res, next) {
	if (req.thread.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
