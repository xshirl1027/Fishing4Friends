'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Message name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}, 
	body: {
		type: String,
		default: '',
		required: 'Don\'t leave the message empty',
		trim: true
	},
	receiving: {
		type: String,
		default: '',
		trim: true
	}
});

mongoose.model('Message', MessageSchema);