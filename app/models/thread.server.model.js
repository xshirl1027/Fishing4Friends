'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Thread Schema
 */
var ThreadSchema = new Schema({
	topic:{
		type: String,
		default: 'MISC',
		trim: true
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Thread name',
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

mongoose.model('Thread', ThreadSchema);