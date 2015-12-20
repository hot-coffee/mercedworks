'use strict';

var logger = require('gruew-logger');
var requestJson = require('request-json');

/**
 *
 * @param serverOptions
 * @param payload - Object/array/string to be json encoded and sent
 * @param callback - Callback with parameters: error and data
 */
module.exports = function(serverOptions, method, payload, callback) {
    logger.log(
        ['sending with server options', serverOptions, 'payload:', payload],
        __filename,
        false
    );

    var path = method.toLowerCase() === 'get' ? serverOptions.getPath : serverOptions.postPath;
    var client = requestJson.createClient(serverOptions.hostAndPort());
    client.post(path, payload, function(err, res, body) {
        if (err) {
            logger.log(['posting to:', serverOptions.postUri()], __filename, true);
        } else {
            logger.log(['response from', serverOptions.postUri(), 'is:', body], __filename, false);
        }

        if (callback) {
            callback(err, body);
        }
    });
};
