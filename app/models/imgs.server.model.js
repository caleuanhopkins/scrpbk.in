'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ImgsSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	uri: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

/*ImgsSchema.pre('save', function(next) {
	if (!this.uri) {
		this.uri = '123';
	}

	next();
});*/

mongoose.model('Imgs', ImgsSchema);
