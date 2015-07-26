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
	},
	rating: {
		score: { type: Number,
				 default: 0
				},
		times_purchased:  { type: Number,
				 default: 0
				},
		comments: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Rating'} ]
	},
	interested: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
	rater: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ]
});

OfferingSchema.index({ '$**': 'text' });
mongoose.model('Offering', OfferingSchema);

