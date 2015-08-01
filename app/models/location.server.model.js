'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Location Schema
 */
var LocationSchema = new Schema({
	
	name: {
		type: String,
		default: '',
		required: 'Please fill in the Location name.',
		trim: true
	},latitude: {
		type: String,
		default: '',
		required: 'Please fill in the Latitude.',
		trim: true
	},longitude: {
		type: String,
		default: '',
		required: 'Please fill in the Longitude.',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

LocationSchema.set('autoIndex', false);
mongoose.model('Location', LocationSchema);