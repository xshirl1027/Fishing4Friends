'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Defines the Mongoose schema for a Rating.
 *
 * @module Ratings
 * @submodule Ratings-Server
 * @class Rating
 * @constructor
 * @param none 
 * @return RatingSchema {Object}
 */
var RatingSchema = new Schema({
	/**
	 * User ID reference for the creator.
	 *
	 * @property user
	 * @type Schema.ObjectId
	 */	
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	/**
	 * Assigned score for the Rating
	 *
	 * @property rating
	 * @type Number
	 * @default -1
	 */	
	rating: {
		type: Number,
		default: -1
	},
	/**
	 * Written comments for the Rating.
	 *
	 * @property comment
	 * @type String
	 * @default ""
	 */	
	comment: {
		type: String,
		default:'',
		trim: true
	},
	/**
	 * Creation date for the Rating
	 *
	 * @property created
	 * @type Date
	 * @default Date.now
	 */	
	created: {
		type: Date,
		default: Date.now
	},

});

mongoose.model('Rating', RatingSchema);