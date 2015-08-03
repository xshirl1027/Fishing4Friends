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
		type: Number,
		default: '',
		required: 'Please fill in the Latitude.',
		trim: true
	},longitude: {
		type: Number,
		default: '',
		required: 'Please fill in the Longitude.',
		trim: true
	}, icon_number: {
		type: Number,
		default: 0
	}, icon_pathname: {
		type: String,
		default: 'modules/locations/img/0.png'
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

mongoose.model('Location', LocationSchema);