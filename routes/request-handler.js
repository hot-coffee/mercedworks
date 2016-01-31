'use strict';

var jsonResponse = require('./../models/json-response');
var jsonSender = require('./../models/json-sender');
var logger = require('gruew-logger');
var path = require('path');
var config = require('./../utils/config');
var uriParamParser = require('./../utils/uri-param-parser');
var _ = require('underscore');
var InstagramController = require('./../controllers/instagram-controller');
var jsonFile = require('jsonfile');


function RequestHandler() {
    this.instagramProfileMap = jsonFile.readFileSync(config.filePaths.instagramProfileMapPath);
    this.index = function (req, res, next) {
        logger.log(['In request handler index method'], __filename, false);
        var params = uriParamParser(req.originalUrl);
        if (!_.isEmpty(params)) {
            logger.log(['index params are:', params], __filename, false);
            this._saveToken(params);
        }

        res.render('index', {
            appName: config.client.appName,
            libScripts: config.client.scripts.lib,
            angularScripts: config.client.scripts.angular,
            customScripts: config.client.scripts.custom,
            styleSheets: config.client.styleSheets
        });
    };

    this.partials = function(req, res, next) {
        logger.log(['In request handler partial method'], __filename, false);
        if (!_.has(req.params, 'name')) {
            logger.log(['request does not have a partial param'], __filename, true);
            res.render('error');
            return;
        }

        logger.log(['page parameter:', req.params.name], __filename, false);
        res.render('partials/' + req.params.name);
    };

    this._saveToken = function (params) {
        if (!_.has(params, 'code')) {
            logger.log(['no access token to save'], __filename, true);
            return;
        }
        
        var instagramController = new InstagramController(params.code);
        instagramController.fetchAccessToken(function (success) {
            var message = success ? 'Successfully fetched token from instagram' :
                'Failed to fetch token from instagram';
            logger.log([message], __filename, !success);
        });
    };

    this.allProfiles = function(req, res, next) {
        var payload = {
            database: config.columbianBeans.database,
            collection: config.columbianBeans.collections.profiles
        };

        jsonSender(config.columbianBeans, 'get', payload, function (error, response) {
            if (error) {
                logger.log(
                    ['Failed to fetch profiles from:', config.columbianBeans.host],
                    __filename,
                    true
                );
            } else {
                logger.log(
                    ['sent payload:', payload, 'received response:', response],
                    __filename,
                    false
                );
            }

            // TODO map should be cached
            var responsePayload = [];
            console.log('response payload', response.payload);
            if (response && response.payload) {
                _.each(response.payload, function(profile) {
                    if (_.has(this.instagramProfileMap, profile.link)) {
                        profile = _.extend(profile, this.instagramProfileMap[profile.link]);
                    }

                    responsePayload.push(profile);
                }, this);
            }

            logger.log(['all profiles client response', responsePayload], __filename, false);
            jsonResponse(res, error, responsePayload);
        }.bind(this));
    };
}

module.exports = RequestHandler;
