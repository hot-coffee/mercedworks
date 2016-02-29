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
var md5Hasher = require('./../utils/md5-hasher');


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
            styleSheets: config.client.styleSheets,
            metaHeaders: config.client.scripts.metaHeaders,
            tagCreator: config.client.tagCreator
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

            if (response && response.payload) {
                logger.log(['all profiles client response', response.payload], __filename, false);
                var profiles = [];
                _.each(response.payload, function (profile) {
                    const picUrl = config.client.s3BaseUrl + profile.picFolder;
                    var pics = [];
                    for (var i = 0; i < profile.interviews.length; i++) {
                        pics.push(picUrl + '/' + i.toString() + '.jpeg');
                    }

                    profile['pics'] = pics;
                    profiles.push(profile);
                });

                profiles.sort(function(profile1, profile2) {
                    return profile1.interviewId < profile2.interviewId;
                });

                jsonResponse(res, null, profiles);
            } else {
                jsonResponse(res, error, null);
            }
        }.bind(this));
    };

    this.instagramRedirectUrl = function (req, res) {
        var redirectUri = config.apiInfo.instagram.redirectUri;
        logger.log(['getting instagram redirect uri:', redirectUri], __filename, false);
        jsonResponse(res, null, {
            redirectUri: redirectUri
        });
    };

    this.fetchInstagramMedia = function (req, res) {
        var igController = new InstagramController();
        igController.fetchRecentMedia(function (error, media) {
            if (error) {
                logger.log(['Failed to fetch media with error:', error], __filename, true);
                jsonResponse(res, error, null);
                return;
            }

            logger.log(['Got media:', media], __filename, false);
            jsonResponse(res, null, media);
        });
    };

    this.saveEmail = function(req, res) {
        if (!_.has(req.body, 'email')) {
            logger.log(['no email in request'], __filename, true);
            jsonResponse(res, new Error('no email in request'), null);
            return;
        }

        var payload = {
            database: config.columbianBeans.database,
            collection: config.columbianBeans.collections.users,
            payload: [{email: req.body.email}]
        };

        jsonSender(config.columbianBeans, 'post', payload, function (error, response) {
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

            jsonResponse(res, error, error ? '' : 'success');
        }.bind(this));

    };
}

module.exports = RequestHandler;
