'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
	threadid:{
		type: Schema.Types.ObjectId,
		ref: 'Thread'
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Post name',
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

PostSchema.set('autoIndex', false);
mongoose.model('Post', PostSchema);