'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Rating Schema
 */
var RatingSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	rating: {
		type: Number,
		default: -1
	},
	comment: {
		type: String,
		default:'',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},

});

mongoose.model('Rating', RatingSchema);