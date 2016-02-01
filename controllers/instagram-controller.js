'use strict';

var jsonFile = require('jsonfile');
var _ = require('underscore');
var config = require('./../utils/config');
var logger = require('gruew-logger');
var queryString = require('querystring');
var async = require('async');
var https = require('https');
var requestJson = require('request-json');


function InstagramController(code) {
    this.code = code;
    this.accessToken = null;
    this.accessData = null;
    this.recentMedia = null;
    this.dbMedia = null;
    this.mediaToSave = null;

    this.fetchAccessToken = function (callback) {
        logger.log(['fetching access token with code:', code], __filename, false);
        async.series([
            this.getAccessToken.bind(this),
            this.saveParams.bind(this)
        ], function(error) {
            if (error) {
                logger.log(['getting access token async:', error], __filename, true);
                if (callback) {
                    callback(false);
                }
                return;
            }

            if (this.accessData && this.accessToken) {
                logger.log(['got access token', this.accessToken], __filename, false);

                if (callback) {
                    callback(true);

                    logger.log(['Attemping to fetch recent media'], __filename, false);

                    this.fetchRecentMedia(function (error, media) {
                        if (error) {
                            logger.log(['Failed to fetch media with error:', error], __filename, true);
                            return;
                        }

                        logger.log(['Got media:', media], __filename, false);
                    })
                }
            } else if (callback) {
                logger.log(['no access token in instagram data'], __filename, true);
                callback(false)
            }
        }.bind(this));
    };

    this.getAccessToken = function (callback) {
        var params = queryString.stringify({
            client_id: config.apiInfo.instagram.clientId,
            client_secret: config.apiInfo.instagram.clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: config.apiInfo.instagram.redirectUri,
            code: this.code
        });

        var options = {
            host: config.apiInfo.instagram.baseUri,
            port: config.apiInfo.instagram.port,
            path: config.apiInfo.instagram.accessTokenPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(params)
            }
        };

        var req = https.request(options, function(res) {
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                logger.log(
                    ['Received chunk of data from', config.apiInfo.instagram.baseUri],
                    __filename,
                    false
                );
                data += chunk;
            });

            res.on('end', function () {
                this.accessData = JSON.parse(data);

                logger.log(['Received access data:', this.accessData], __filename, false);

                if (_.has(this.accessData, 'access_token')) {
                    this.accessToken = this.accessData['access_token'];
                }

                callback();
            }.bind(this));
        }.bind(this));

        req.on('error', function(error) {
            callback(error);
        });

        req.write(params);
        req.end();
    };

    this.saveParams = function (callback) {
        if (!this.accessToken) {
            logger.log(['missing instagram access token'], __filename, true);
            callback();
            return;
        }

        var params = {accessToken: this.accessToken, code: this.code};
        var options = {flags: 'w'};

        jsonFile.writeFile(
            config.filePaths.instagramParamsPath,
            params,
            options,
            function(error) {
                if (error) {
                    logger.log([
                            'could not save instagram parms to file:',
                            config.filePaths.instagramParamsPath
                        ],
                        __filename,
                        true
                    );

                    callback(new Error('Could not save to file'));
                    return;
                }

            callback();
        }.bind(this));
    };

    this.fetchRecentMedia = function(callback) {
        async.series([
            this.getParams.bind(this),
            this._getRecentMedia.bind(this),
            this._recentMediaFromDb.bind(this),
            this._saveRecentMedia.bind(this)
        ], function (error) {
            if (error) {
                callback(error, null);
                return;
            }

            callback(null, this.mediaToSave);
        }.bind(this));
    };

    this.getParams = function(callback) {
        jsonFile.readFile(config.filePaths.instagramParamsPath, function(error, data) {
            logger.log(['getting params'], __filename, false);

            if (error) {
                callback(error);
                return;
            }

            if (!_.has(data, 'accessToken')) {
                logger.log(
                    ['could not get parameters', 'from file:', config.filePaths.instagramParamsPath],
                    __filename,
                    true
                );

                callback(new Error('no parameters in: ' + config.filePaths.instagramParamsPath));
                return;
            }

            logger.log(
                ['got paramters:', data, 'from file:', config.filePaths.instagramParamsPath],
                __filename,
                false
            );

            this.accessToken = data.accessToken;
            callback();
        }.bind(this));
    };

    this._getRecentMedia = function (callback) {
        if (!this.accessToken) {
            callback(new Error('no access token'));
            return;
        }

        var params = {
            access_token: this.accessToken
        };

        var options = {
            host: config.apiInfo.instagram.baseUri,
            port: config.apiInfo.instagram.port,
            path: config.apiInfo.instagram.recentMediaPath + this.constructUriPath(params),
            method: 'GET'
        };

        var req = https.request(options, function(res) {
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                logger.log(
                    ['Received chunk of data from', config.apiInfo.instagram.baseUri],
                    __filename,
                    false
                );

                data += chunk;
            });

            res.on('end', function () {
                var media = JSON.parse(data);
                if (_.has(media, 'data')) {
                    this._parseRecentMedia(media.data);
                }

                logger.log(['Received recent media', this.recentMedia], __filename, false);
                callback();
            }.bind(this));
        }.bind(this));

        req.on('error', function(error) {
            callback(error);
        });

        req.end();
    };

    this._recentMediaFromDb = function(callback) {
        if (!this.recentMedia) {
            callback(new Error('no recent media'));
            return;
        }

        var data = {
            database: config.columbianBeans.database,
            collection: config.columbianBeans.collections.profiles
        };

        var client = requestJson.createClient(config.columbianBeans.hostAndPort());
        client.post(config.columbianBeans.getPath, data, function (err, res, data) {
            if (err) {
                logger.log(['Failed to retrieve entries from db:', err], __filename, true);
                callback(new Error('Failed to retrieve entries from db'));
                return;
            }

            logger.log(['Posted to database. Response:', data], __filename, false);
            this.dbMedia = data.result || [];
            callback();
        }.bind(this));
    };

    this._saveRecentMedia = function (callback) {
        if (!this.recentMedia || this.recentMedia.length === 0 || !this.dbMedia) {
            logger.log(['could not save media to db. media is empty'], __filename, true);
            callback(new Error('could not save media to db. media is empty'));
            return;
        }

        this.mediaToSave = [];
        _.each(this.recentMedia, function(entry) {
            var shouldAdd = true;
            for (var i=0; i < this.dbMedia.length; i++) {
                if (this.dbMedia[i].link === entry.link) {
                    shouldAdd = false;
                    break;
                }
            }

            if (shouldAdd) {
                this.mediaToSave.push(entry);
            }
        }, this);

        if (this.mediaToSave.length === 0) {
            logger.log(['No new entries to save'], __filename, false);
            callback();
            return;
        }

        logger.log(['Media to save', this.mediaToSave], __filename, false);

        var data = {
            database: config.columbianBeans.database,
            collection: config.columbianBeans.collections.profiles,
            payload: this.mediaToSave
        };

        var client = requestJson.createClient(config.columbianBeans.hostAndPort());
        client.post(config.columbianBeans.postPath, data, function (err, res, data) {
            if (err) {
                callback(err);
                return;
            }

            logger.log(['Posted recent media to columbian beans'], __filename, false);
            callback();
        }.bind(this));
    };

    this._parseRecentMedia = function (media) {
        this.recentMedia = [];
        _.each(media, function (entry) {
            this.recentMedia.push({
                link: entry.link,
                pic: entry.images['standard_resolution'].url,
                text: entry.caption.text,
                timeCreated: entry['created_time']
            });
        }, this);
    };

    this.constructUriPath = function(params) {
        var uri = '?';
        _.each(params, function(value, key) {
            uri += key + '=' + value + '&';
        });

        return uri.substring(0, uri.length - 1);
    };
}

module.exports = InstagramController;
