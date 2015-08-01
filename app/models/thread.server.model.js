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
	messageboardId:{
		type: String,
		default: '',
		trim: true
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Thread name',
		trim: true
	},
	message: {
		type: String,
		default: '',
		required: 'Please enter a message',
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

ThreadSchema.set('autoIndex', false);
mongoose.model('Thread', ThreadSchema);