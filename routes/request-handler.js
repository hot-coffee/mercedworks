'use strict';

var jsonResponse = require('./../models/json-response');
var JsonSender = require('./../models/json-sender');
var serverOptions = require('./../models/server-options');
var logger = require('gruew-logger');

function RequestHandler() {
    this.index = function (req, res, next) {
        res.render('index', {title: 'Express'});
    };

    this.gotToken = function (req, res, next) {
        res.render('got-token', {title: 'Got Token'});
    };

    this.saveToken = function (req, res, next) {
        var payload = req.body;
        var response = null;
        var error = null;
        if (payload.instagramKey) {
            logger(['the key is:', payload.instagramKey], __filename, false, false);
            response = 'got the key';
        } else {
            logger(['no insta key in payload'], __filename, true, false);
            error = 'could not get the key';
        }

        jsonResponse(res, error, response);
        console.log('sending:', payload);
        if (!error) {
            var jsonSender = new JsonSender(serverOptions.instagram, payload);
            jsonSender.send(function (error, data) {
                if (error) {
                    logger(
                        ['Error failed to send token to server with error', error],
                        __filename,
                        true,
                        false
                    );
                    return;
                }

                logger(
                    ['sent payload:', payload, 'received response:', data],
                    __filename,
                    false,
                    false
                );
            });
        }
    };
}

module.exports = RequestHandler;
