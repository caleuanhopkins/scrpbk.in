'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Scrpbk = mongoose.model('Scrpbk'),
	_ = require('lodash');

/**
 * Create a scrpbk
 */
exports.create = function(req, res) {
	var scrpbk = new Scrpbk(req.body);
	scrpbk.user = req.user;

	scrpbk.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(scrpbk);
		}
	});
};

/**
 * Show the current scrpbk
 */
exports.read = function(req, res) {
	res.json(req.scrpbk);
};

/**
 * Update a scrpbk
 */
exports.update = function(req, res) {
	var scrpbk = req.scrpbk;

	scrpbk = _.extend(scrpbk, req.body);

	scrpbk.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(scrpbk);
		}
	});
};

/**
 * Delete an scrpbk
 */
exports.delete = function(req, res) {
	var scrpbk = req.scrpbk;

	scrpbk.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(scrpbk);
		}
	});
};

/**
 * List of Scrpbks
 */
exports.list = function(req, res) {
	Scrpbk.find().sort('-created').populate('user', 'displayName').exec(function(err, scrpbks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(scrpbks);
		}
	});
};

/**
 * Scrpbk middleware
 */
exports.scrpbkByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Scrpbk is invalid'
		});
	}

	Scrpbk.findById(id).populate('user', 'displayName').exec(function(err, scrpbk) {
		if (err) return next(err);
		if (!scrpbk) {
			return res.status(404).send({
				message: 'Scrpbk not found'
			});
		}
		req.scrpbk = scrpbk;
		next();
	});
};

/**
 * Scrpbk authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.scrpbk.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
