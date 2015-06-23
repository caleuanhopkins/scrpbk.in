'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Img = mongoose.model('Imgs'),
	_ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	phantom = require('phantom'),
	chance = require('chance'),
	User = mongoose.model('User');

/**
 * Create a scrpbk
 */
exports.create = function(req, res) {
	
	var img = new Img(req.body);
	//img.uri = uri;
	img.user = req.user;
	//img.scrpbk = req.scrpbk_sel;

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

exports.createUrl = function(req, res) {
	var img = new Img(req.body);

	var phantom = require('phantom');

	var pageUrl = req.body.url;

	var ranChance = new chance();
	var screenShotName = ranChance.string({pool:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'});

	phantom.create("--ignore-ssl-errors=yes", "--ssl-protocol=any", function (ph) {
		ph.createPage(function (page) {
			page.set('settings.userAgent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36');
			page.set('viewportSize', {width: 1200, height: 1}, function(){
				page.open(pageUrl, function(status) {
					page.render('./public/uploads/'+screenShotName+'.jpeg', function(finished){
						var uri = encodeURIComponent('/uploads/'+screenShotName+'.jpeg');
						res.json(uri);
						ph.exit();
					});							
				});
			});
		});
	});


	/*img.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(img);
		}
	});	*/

};


exports.urlGrabImages = function(req, res) {

	var img = new Img(req.body);

	var pageUrl = req.body.url;

    var request = require('request');
    var url = require('url');
    var cheerio = require('cheerio');
    var path = require('path')
    var fs = require('fs');
 
    request(pageUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body)
            var imgs = $('img').toArray()
            var imgList = [];
            //console.log("Downloading...")
            imgs.forEach(function (img) {
                //console.log(img.attribs.src)
                process.stdout.write(".");
                imgList.push({'src':img.attribs.src});
                /*if (/^https?:\/\//.test(img_url)) {
                    img_name = path.basename(img_url)
                    request(img_url).pipe(fs.createWriteStream(img_name))
                }*/
            })
            //console.log("Done!")
            res.json(imgList);
        }
    })
};

exports.downloadImage = function(req, res) {
	
	var pageUrl = req.body.url;

	var https = require('https');
	var fs = require('fs');

	var ranChance = new chance();
	var screenShotName = ranChance.string({pool:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'});

	var file = fs.createWriteStream('./public/uploads/'+screenShotName+'.jpeg');
	var request = https.get(pageUrl, function(response) {
		var dlFile = response.pipe(file);
		var uri = encodeURIComponent(file.path.replace('./public/', '/'));
		res.json(uri);
	});
	request.on('error', function(err) {
	    res.json({error:'connection refused'});
	});

	request.end();
};

exports.upload = function(req, res){
	if(req.done === true){
		var uri = encodeURIComponent(req.file.path.replace('public/', '/'));
		res.json(uri);
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
	var uri = decodeURIComponent(img.uri);
	var appDir = path.dirname(require.main.filename);

	fs.stat(appDir+'/public/'+uri, function (err, stats) {
		if (err) throw err;
		console.log('stats: ' + JSON.stringify(stats));
	});

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
	Img.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, img) {
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
