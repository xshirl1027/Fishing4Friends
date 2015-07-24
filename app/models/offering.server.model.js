'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Offering Schema
 */
var OfferingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Offering name',
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
	description: {
		type: String,
		default: 'blankity-blank',
		required: 'Please fill Offering description',
		trim: true
	},
	location: {
		coordinates: {
			latitude: {
				type: Number,
				default: 0
			},
			longitude: {
				type: Number,
				default: 0
			}
		},
		postal_code: {
			type: String,
			default: '',
			trim: true
		}
	},
	price: {
		type: Number,
		default: 0
	},
	transaction: {
		type: String,
		default: ''
	}
});

mongoose.model('Offering', OfferingSchema);
