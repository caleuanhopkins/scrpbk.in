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
	tags: {
		type: Array,
		default: [],
	},
	scrpbk_sel: {
		type: String,
		default: 0
	},
	orig_url: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

/*ImgsSchema.pre('query', function(next) {
	if (!this.uri) {
		this.uri = '123';
	}

	next();
});*/

mongoose.model('Imgs', ImgsSchema);
