'use strict';

const queryString = require('querystring');
const config = require('./../utils/config');
const logger = require('gruew-logger');
const jsonFile = require('jsonfile');
const _ = require('underscore');
const instagramUriCreator = require('./../utils/instagram-uri-creator');
const https = require('https');
const columbianBeansInterface = require('./../utils/columbian-beans-interface');


var getParams = function() {
    const params = jsonFile.readFileSync(config.filePaths.instagramParamsPath);
    if (params && _.has(params, 'accessToken') && _.has(params, 'code')) {
        return params;
    }

    logger.log(['Could not read params', config.filePaths.instagramParamsPath], __filename, true);
    return null;
};

var parseHashData = function(incomingData) {
    var payload = JSON.parse(incomingData);
    if (!_.has(payload, 'data')) {
        logger.log(['payload does not have data array'], __filename, true);
        return null;
    }

    var hashedData = [];
    _.each(payload.data, function(datum) {
        hashedData.push({
            link: datum.link,
            pic: datum.images.standard_resolution.url,
            caption: datum.caption.text,
            userName: datum.user.username,
            userPic: datum.user.profile_picture,
            userId: datum.user.id,
            userFullName: datum.user.full_name,
            dateCreated: parseInt(datum.created_time),
            type: 'instagram'
        });
    });

    return hashedData;
};

var saveHashedData = function(hashedData, callback) {
    columbianBeansInterface(
        config.columbianBeans.getPath,
        config.columbianBeans.collections.hashTagProfiles,
        null,
        function(error, response) {
            if (error) {
                callback(error, null);
                return;
            }

            _.each(hashedData, function(datum) {
                datum.type = 'instagram';
            });

            var uniqueData = [];
            var dbData = response && response.payload && response.payload.length > 0 ? response.payload : [];
            if (dbData.length > 0) {
                var hashedDataMap = {};
                _.each(hashedData, function(hashedDatum) {
                    hashedDataMap[hashedDatum.link] = hashedDatum;
                });

                _.each(dbData, function(hashedDatum) {
                    if (!_.has(hashedDataMap, hashedDatum.link)) {
                        uniqueData.push(hashedDatum);
                    }
                });
            } else {
                uniqueData = hashedData;
            }

            columbianBeansInterface(
                config.columbianBeans.postPath,
                config.columbianBeans.collections.hashTagProfiles,
                uniqueData,
                function(error, response) {
                    if (error) {
                        logger.log(['failed to save hashed data to columbian beans'], __filename, false);
                        return;
                    }

                    logger.log(['Successfully saved hashed data to columbian beans'], __filename, false);
                }
            );

            callback(null, dbData.concat(uniqueData));
        }
    );
};

module.exports.getAccessToken = function(instagramCode, callback) {
    const params = queryString.stringify({
        client_id: config.apiInfo.instagram.clientId,
        client_secret: config.apiInfo.instagram.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: config.apiInfo.instagram.redirectUri,
        code: instagramCode
    });

    const options = {
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
        res.on('data', function(chunk) {
            logger.log(
                ['Received chunk of data from', config.apiInfo.instagram.baseUri],
                __filename,
                false
            );

            data += chunk;
        });

        res.on('end', function() {
            var accessData = JSON.parse(data);
            logger.log(['Received access data:', accessData], __filename, false);

            if (_.has(accessData, 'access_token')) {
                const params = {
                    accessToken: accessData.access_token,
                    code: instagramCode
                };

                jsonFile.writeFileSync(config.filePaths.instagramParamsPath, params);
                callback(null);
            }

            callback(new Error('Response did not contain access data'));
        });
    });

    req.on('error', function(error) {
        callback(error);
    });

    req.write(params);
    req.end();
};

module.exports.getHashTagMedia = function(callback) {
    const instagramParams = getParams();
    if (!instagramParams || !_.has(instagramParams, 'accessToken') || !_.has(instagramParams, 'code')) {
        const message = 'could not get hash tag media. No params present';
        logger.log([message], __filename, true);
        callback(new Error(message), null);
        return;
    }

    const params = {access_token: instagramParams.accessToken};
    const uriParams = {pathType: 'get-recent-hash-tags', tag: 'mercedworks'};
    const options = {
        host: config.apiInfo.instagram.baseUri,
        port: config.apiInfo.instagram.port,
        path: instagramUriCreator(uriParams, params),
        method: 'GET'
    };

    var req = https.request(options, function(res) {
        var data = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            logger.log(
                ['Received chunk of data from', config.apiInfo.instagram.baseUri],
                __filename,
                false
            );

            data += chunk;
        });

        res.on('end', function() {
            logger.log(
                ['Received', Buffer.byteLength(data), 'from', config.apiInfo.instagram.baseUri],
                __filename,
                false
            );

            var hashedData = parseHashData(data);
            saveHashedData(hashedData, callback);
        });
    });

    req.on('error', function(error) {
        callback(error, null);
    });

    req.end();
};
