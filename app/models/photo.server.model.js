'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Defines the Mongoose schema for a Photo.
 *
 * @module Photos
 * @submodule Photos-Server
 * @class Photo
 * @constructor
 * @param none 
 * @return PhotoSchema {Object}
 */
var PhotoSchema = new Schema({
	/**
	 * Name of the Photo.
	 *
	 * @property name
	 * @type String
	 * @default ""
	 */
	name: {
		type: String,
		default: '',
		trim: true
	},
	/**
	 * Creation date for the Photo
	 *
	 * @property created
	 * @type Date
	 * @default Date.now
	 */
	created: {
		type: Date,
		default: Date.now
	},
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
	 * Source data for the Photo.
	 *
	 * @property src
	 * @type String
	 */	src: {
		type: String
	}
});

PhotoSchema.set('autoIndex', false);
mongoose.model('Photo', PhotoSchema);
