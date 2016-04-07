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
var instagramFetchController = require('./../controllers/instagram-fetch-controller');
var requestProfilesHelper = require('./../handlers/request-profiles-helper');
var profileCreator = require('./../models/profile-creator');


function RequestHandler() {
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

        instagramFetchController(params.code);

        //var instagramController = new InstagramController(params.code);
        //instagramController.fetchAccessToken(function (success) {
        //    var message = success ? 'Successfully fetched token from instagram' :
        //        'Failed to fetch token from instagram';
        //    logger.log([message], __filename, !success);
        //});
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
                const now = new Date().getTime();
                for (var i=0; i < response.payload.length; i++) {
                    const profile = response.payload[i];
                    console.log('profile date:', Date.parse(profile.date));
                    console.log('now:', now);
                    if (Date.parse(profile.date) > now) {
                        continue;
                    }

                    const picUrl = config.client.s3BaseUrl + profile.picFolder;
                    var pics = [];
                    for (var j = 0; j < profile.interviews.length; j++) {
                        pics.push(picUrl + '/' + j.toString() + '.jpeg');
                    }

                    profile.pics = pics;
                    profiles.push(profile);
                }

                profiles.sort(function(profile1, profile2) {
                    const date1 = Date.parse(profile1.date);
                    const date2 = Date.parse(profile2.date);
                    return date1 < date2;
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

        const payload1 = {
            database: config.columbianBeans.database,
            collection: config.columbianBeans.collections.users
        };

        jsonSender(config.columbianBeans, 'get', payload1, function(error1, response) {
            if (error1) {
                logger.log(
                    ['Failed to fetch emails from:', config.columbianBeans.host],
                    __filename,
                    true
                );
            }

            const users = response.payload;
            var isRepeatEmail = false;
            for (var i=0; i < users.length; i++) {
                const user = users[i];
                if (user.email.toLowerCase() === req.body.email.toLowerCase()) {
                    isRepeatEmail = true;
                    break;
                }
            }

            if (isRepeatEmail) {
                jsonResponse(res, null, 2);
                return;
            }

            const payload2 = {
                database: config.columbianBeans.database,
                collection: config.columbianBeans.collections.users,
                payload: [{email: req.body.email}]
            };

            jsonSender(config.columbianBeans, 'post', payload2, function (error2, response2) {
                if (error2) {
                    logger.log(
                        ['Failed to fetch profiles from:', config.columbianBeans.host],
                        __filename,
                        true
                    );
                } else {
                    logger.log(
                        ['sent payload:', payload2, 'received response:', response2],
                        __filename,
                        false
                    );
                }

                jsonResponse(res, error2, error2 ? null : 0);
            });
        });
    };

    this.profiles = function (req, res, next) {
        requestProfilesHelper(req, res, function(error, profiles, hashTagProfiles) {
            if (error) {
                jsonResponse(res, error, null);
                return;
            }

            var mercedWorksProfiles = [];
            var socialMediaProfiles = [];
            _.each(profiles, function(profile) {
                const picUrl = config.client.s3BaseUrl + profile.picFolder;
                var pics = [];
                for (var i = 0; i < profile.interviews.length; i++) {
                    pics.push(picUrl + '/' + i.toString() + '.jpeg');
                }

                profile.pics = pics;
                profile.type = 'mercedworks';
                profile.userPic = pics[0];
                mercedWorksProfiles.push(profileCreator(profile));
            });

            _.each(hashTagProfiles, function(profile) {
                socialMediaProfiles.push(profileCreator(profile));
            });

            var payload = {
                mercedWorks: mercedWorksProfiles,
                socialMedia: socialMediaProfiles
            };

            jsonResponse(res, null, payload);
        });
    };
}

module.exports = RequestHandler;
