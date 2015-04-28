'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	scrpbk = require('../../app/controllers/scrpbk.server.controller'),
	img = require('../../app/controllers/imgs.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/imgs')
		.get(img.list)
		.post(users.requiresLogin, img.create);

	app.route('/imgs/:imgId')
		.get(img.read)
		.put(users.requiresLogin, img.hasAuthorization, img.update)
		.delete(users.requiresLogin, img.hasAuthorization, img.delete);

	// Finish by binding the article middleware
	app.param('imgId', img.imgByID);
};
