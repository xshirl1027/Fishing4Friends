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
		required: 'Please write a message',
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
	receiving: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	sentby:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	read:{		
		type: Boolean,
		default: false
	}
});

MessageSchema.set('autoIndex', false);
mongoose.model('Message', MessageSchema);