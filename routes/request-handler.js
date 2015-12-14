'use strict';

var jsonResponse = require('./../models/json-response');
var JsonSender = require('./../models/json-sender');
var serverOptions = require('./../models/server-options');
var logger = require('gruew-logger');

function RequestHandler() {
    this.index = function (req, res, next) {
        res.render('index', {title: 'Merced Works'});
    };

    this.gotToken = function (req, res, next) {
        res.render('got-token', {title: 'Got Token'});
    };

    this.saveToken = function (req, res, next) {
        var payload = req.body;
        var response = null;
        var error = null;
        if (payload) {
            logger.log(['the payload is:', payload], __filename, false);
            response = 'got the payload';
        } else {
            logger.log(['no payload'], __filename, true);
            error = 'could not get the payload';
        }

        jsonResponse(res, error, response);
        console.log('sending:', payload);
        if (!error) {
            var jsonSender = new JsonSender(serverOptions.instagram, payload);
            jsonSender.send(function (error, data) {
                if (error) {
                    logger.log(
                        ['Error failed to send token to server with error', error],
                        __filename,
                        true
                    );
                    return;
                }

                logger.log(
                    ['sent payload:', payload, 'received response:', data],
                    __filename,
                    false
                );
            });
        }
    };
}

module.exports = RequestHandler;
