'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	scrpbk = require('../../app/controllers/scrpbk.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/scrpbks')
		.get(scrpbk.list)
		.post(users.requiresLogin, scrpbk.create);

	app.route('/scrpbks/:scrpbkId')
		.get(scrpbk.read)
		.put(users.requiresLogin, scrpbk.hasAuthorization, scrpbk.update)
		.delete(users.requiresLogin, scrpbk.hasAuthorization, scrpbk.delete);

	// Finish by binding the article middleware
	app.param('scrpbkId', scrpbk.scrpbkByID);
};
