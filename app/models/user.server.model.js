'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');


/**
 * A Validation function for local strategy properties.
 *
 * @method validateLocalStrategyProperty
 * @param property {Object} 
 * @return boolean
 */
 var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};


/**
 * A Validation function for local strategy password.
 *
 * @method validateLocalStrategyPassword
 * @param password {Object} 
 * @return boolean
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * Defines the Mongoose schema for a User.
 *
 * @module Users
 * @submodule Users-Server
 * @class User
 * @constructor
 * @param none 
 * @return UserSchema {Object}
 */
var UserSchema = new Schema({
	/**
	 * User's first name. REQUIRED.
	 * Applies the validateLocalStrategyProperty to validate the input.
	 *
	 * @property firstName
	 * @type String
	 * @default ""
	 */
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	/**
	 * User's last name. REQUIRED.
	 * Applies the validateLocalStrategyProperty to validate the input.
	 *
	 * @property lastName
	 * @type String
	 * @default ""
	 */
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	/**
	 * User's display name.
	 *
	 * @property displayName
	 * @type String
	 */
	displayName: {
		type: String,
		trim: true
	},
	/**
	 * User's interests.
	 *
	 * @property interests
	 * @type String
	 * @default ""
	 */
	interests: {
		type: String,
		trim: true,
		default: '',
	},
	/**
	 * User's email. REQUIRED.
	 * Applies the validateLocalStrategyProperty and a REGEX to validate the input.
	 *
	 * @property email
	 * @type String
	 * @default ""
	 */
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	/**
	 * User's credential: username. REQUIRED.
	 * Must be unique.
	 *
	 * @property username
	 * @type String
	 * @default ""
	 */
	username: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in a username',
		trim: true
	},
	/**
	 * User's credential: password. REQUIRED.
	 * Applies the validateLocalStrategyPassword to validate the input.
	 *
	 * @property password
	 * @type String
	 * @default ""
	 */
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	/**
	 * User's password salt.
	 *
	 * @property salt
	 * @type String
	 */
	salt: {
		type: String
	},
	/**
	 * User's credentials authentication strategy. REQUIRED.
	 *
	 * @property provider
	 * @type String
	 */
	provider: {
		type: String,
		required: 'Provider is required'
	},
	/**
	 * User's authentication provider data (Facebook, Twitter, etc...).
	 *
	 * @property providerData
	 * @type undefined
	 */
	providerData: {},
	/**
	 * Additional authentication provider data (Facebook, Twitter, etc...).
	 *
	 * @property additionalProvidersData
	 * @type undefined
	 */
	additionalProvidersData: {},
	/**
	 * User's roles on the site.
	 *
	 * @property roles
	 * @type array[String]
	 * @default 'user'
	 */
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	/**
	 * Date of most recent User update.
	 *
	 * @property updated
	 * @type Date
	 */
	updated: {
		type: Date
	},
	/**
	 * Date of User creation.
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
	 * Password reset token to facilitate a password reset.
	 *
	 * @property resetPasswordToken
	 * @type String
	 */
	resetPasswordToken: {
		type: String
	},
	/**
	 * Date that the password reset token expires.
	 *
	 * @property resetPasswordExpires
	 * @type Date
	 */
	resetPasswordExpires: {
		type: Date
	},
	/**
	 * User's profile photo.
	 *
	 * @property profile_pic
	 * @type Schema.ObjectId
	 */
	profile_pic: {
		type: Schema.ObjectId,
		ref: 'Photo'
	}
});


/**
 * Hook a pre save method to hash the password.
 *
 * @method validateLocalStrategyProperty
 * @param 'save' {Object} 
 * @param anonymous {Function} 
 * @return nothing
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});


 /**
 * Create instance method for hashing a password.
 *
 * @method hashPassword
 * @param password {String} 
 * @return password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};


/**
 * Create instance method for authenticating user.
 *
 * @method authenticate
 * @param password {String} 
 * @return boolean
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};


 /**
 * Find possible not used username.
 *
 * @method findUniqueUsername
 * @param username {String} 
 * @param suffix {String} 
 * @param callback {Function} 
 * @return nothing
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

UserSchema.set('autoIndex', false);
mongoose.model('User', UserSchema);
