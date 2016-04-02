'use strict';

const queryString = require('querystring');
const config = require('./../utils/config');
const logger = require('gruew-logger');
const jsonFile = require('jsonfile');
const _ = require('underscore');
const constructUri = require('./../utils/construct-uri');


module.exports.getAccessToken = function (instagramCode, callback) {
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

    var req = https.request(options, function (res) {
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

        res.on('end', function() {
            var accessData = JSON.parse(data);

            logger.log(['Received access data:', accessData], __filename, false);

            if (_.has(accessData, 'access_token')) {
                const params = {
                    accessToken: accessData.access_token,
                    code: instagramCode
                };

                jsonFile.writeFileSync(config.filePaths.instagramParamsPath, params);
            }

            callback();
        });
    });

    req.on('error', function (error) {
        callback(error);
    });

    req.write(params);
    req.end();
};

module.exports.getParams = function() {
    const params = jsonFile.readFileSync(config.filePaths.instagramParamsPath);
    if (params && _.has(params, 'accessToken') && _.has(params, 'code')) {
        return params;
    }

    logger.log(['Could not read params', config.filePaths.instagramParamsPath], __filename, true);
    return null;
};

module.exports.getHashTagMedia = function() {
    
};

