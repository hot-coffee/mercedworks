'use strict';

var logger = require('gruew-logger');
var requestJson = require('request-json');

function JsonSender(serverOptions, payload) {
    this.payload = payload;
    this.serverOptions = serverOptions;

    /**
     *
     * @param callback - args error, data
     */
    this.send = function (callback) {
        var client = requestJson.createClient(this.serverOptions.hostAndPort());
        client.post(this.serverOptions.path, this.payload, function(err, res, body) {
            if (err) {
                logger(['posting to:', this.serverOptions.uri()], __filename, true, false);
                return;
            }

            logger(['response from', this.serverOptions.uri(), 'is:', body], __filename, false, false);
            if (callback) {
                callback(err, body);
            }
        }.bind(this));
    };
}

module.exports = JsonSender;
