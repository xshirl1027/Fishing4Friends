'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Messageboard Schema
 */

var MessageboardSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Messageboard name',
		trim: true
	},
	message: {
		type: String,
		default: '',
		required: 'Please fill Messageboard message',
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

MessageboardSchema.set('autoIndex', false);
MessageboardSchema.index({ '$**': 'text' });
mongoose.model('Messageboard', MessageboardSchema);