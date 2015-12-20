'use strict';

var cache = require('./cache');
var jsonFile = require('jsonfile');
var JsonResponse = require('./json-response');
var Config = require('./config');
var Logger = require('./logger');
var ResponseCodes = require('./response-codes');

function RequestHandler() {
    this.getAllProfiles = function (req, res) {
        var profiles = cache.getItem('profiles');
        if (profiles) {
            this._makeResponse(null, profiles, res);
            return;
        }

        jsonFile.readFile(Config.profileFilePath, function(error, object) {
            if (error) {
                Logger.log(
                    'Failed to read file from: ' + Config.profileFilePath,
                    __filename,
                    true,
                    false
                );

                this._makeResponse(ResponseCodes.errors.internalServerError, null, res);
                return;
            }

            cache.addItem('profiles', object);
            this._makeResponse(null, object, res);
        }.bind(this));
    };

    this._makeResponse = function (error, result, response) {
        var jsonResponse = new JsonResponse(error, result, response);
        jsonResponse.respond();
    };
}

module.exports = RequestHandler;
