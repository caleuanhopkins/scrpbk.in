'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	img = require('../../app/controllers/imgs.server.controller');

module.exports = function(app) {
	//console.log(app.done);
	// Article Routes
	app.route('/imgs')
		.get(users.requiresLogin,img.list)
		.post(users.requiresLogin, img.create);

	app.route('/imgs/upload')
		.post(users.requiresLogin, img.upload);

	app.route('/imgs/urlCapture')
		.post(users.requiresLogin, img.createUrl);

	app.route('/imgs/:imgId')
		.get(users.requiresLogin,img.read)
		.put(users.requiresLogin, img.hasAuthorization, img.update)
		.delete(users.requiresLogin, img.hasAuthorization, img.delete);

	// Finish by binding the article middleware
	app.param('imgId', img.imgByID);
};
