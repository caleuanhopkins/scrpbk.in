'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Img = mongoose.model('Imgs'),
	_ = require('lodash');

/**
 * Create a scrpbk
 */
exports.create = function(req, res) {
	  if(req.done==true){
	    console.log(req.files);
	    res.end("File uploaded.");
	  }
};

/**
 * Show the current scrpbk
 */
exports.read = function(req, res) {
	res.json(req.img);
};

/**
 * Update a scrpbk
 */
exports.update = function(req, res) {
	var img = req.img;

	img = _.extend(img, req.body);

	img.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(img);
		}
	});
};

/**
 * Delete an scrpbk
 */
exports.delete = function(req, res) {
	var img = req.img;

	img.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(img);
		}
	});
};

/**
 * List of Scrpbks
 */
exports.list = function(req, res) {
	Img.find().sort('-created').populate('user', 'displayName').exec(function(err, img) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(img);
		}
	});
};

/**
 * Scrpbk middleware
 */
exports.imgByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Img is invalid'
		});
	}

	Img.findById(id).populate('user', 'displayName').exec(function(err, img) {
		if (err) return next(err);
		if (!img) {
			return res.status(404).send({
				message: 'Img not found'
			});
		}
		req.img = img;
		next();
	});
};

/**
 * Scrpbk authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.img.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
