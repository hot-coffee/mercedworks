'use strict';

var jsonResponse = require('./../models/json-response');
var JsonSender = require('./../models/json-sender');
var serverOptions = require('./../models/server-options');

function RequestHandler() {
    this.index = function (req, res, next) {
        res.render('index', {title: 'Express'});
    };

    this.gotToken = function (req, res, next) {
        res.render('got-token', {title: 'Got Token'});
    };

    this.saveToken = function (req, res, next) {
        console.log('got the save-token request');
        var payload = req.body;
        var response = null;
        var error = null;
        if (payload.instagramKey) {
            console.log('the key is:', payload.instagramKey);
            response = 'got the key';
        } else {
            console.log('there is no instagram key in the payload');
            error = 'could not get the key';
        }

        jsonResponse(res, error, response);

        if (!error) {
            var jsonSender = new JsonSender(serverOptions.instagram);
            jsonSender.send(function (error, data) {
                if (error) {
                    console.log('Error failed to send token to server with error', error);
                    return;
                }

                console.log('sent token to server and got response:', data);
            });
        }
    };
}

module.exports = RequestHandler;
