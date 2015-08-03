'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Defines the Mongoose schema for an Offering.
 *
 * @module Offerings
 * @submodule Offerings-Server
 * @class Offering
 * @constructor
 * @param none 
 * @return OfferingSchema {Object}
 */
var OfferingSchema = new Schema({
	/**
	 * Name of the offering.
	 *
	 * @property name
	 * @type String
	 * @default ""
	 */
	name: {
		type: String,
		default: '',
		required: 'Please fill Offering name',
		trim: true
	},
	/**
	 * Creation date for the offering
	 *
	 * @property created
	 * @type Date
	 * @default Date.now
	 */
	created: {
		type: Date,
		default: Date.now
	},
	/**
	 * User ID reference for the creator.
	 *
	 * @property user
	 * @type Schema.ObjectId
	 */
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	/**
	 * Text description ofthe offering.
	 *
	 * @property description
	 * @type String
	 * @default ""
	 */
	description: {
		type: String,
		default: '',
		required: 'Please fill Offering description',
		trim: true
	},
	/**
	 * Location for the offering.
	 *
	 * @property location
	 * @type sub-document
	 */
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
	/**
	 * Price for the offering.
	 *
	 * @property price
	 * @type Number
	 * @default 0
	 */
	price: {
		type: Number,
		default: 0
	},
	/**
	 * Transaction type for the offering (rent/buy/other).
	 * Not yet implemented in the views.
	 *
	 * @property transaction
	 * @type String
	 * @default ""
	 */
	transaction: {
		type: String,
		default: ''
	},
	/**
	 * Users' ratings of the offering.
	 *
	 * @property rating
	 * @type sub-document
	 */
	rating: {
		score: { type: Number,
				 default: 0
				},
		times_purchased:  { type: Number,
				 default: 0
				},
		comments: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Rating'} ]
	},
	/**
	 * Array of users interestd in the offering.
	 *
	 * @property interested
	 * @type Schema.ObjectId
	 */
	interested: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
	/**
	 * Array of users who have come to a puchase agreement with the owner.
	 *
	 * @property rater
	 * @type Schema.ObjectId
	 */
	rater: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
	/**
	 * Image of the offering, by document reference ID.
	 *
	 * @property offering_pic
	 * @type Schema.ObjectId
	 */
	offering_pic: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Photo'
	}
});

OfferingSchema.set('autoIndex', false);
OfferingSchema.index({ '$**': 'text' });
mongoose.model('Offering', OfferingSchema);

