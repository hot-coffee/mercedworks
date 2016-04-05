'use strict';

var instagramHandlers = require('./../handlers/instagram-handlers');
var logger = require('gruew-logger');

var media = [];

module.exports = function(code) {
    media = null;
    //instagramHandlers.getAccessToken(code, function(error) {
    //    if (error) {
    //        logger.log([error], __filename, true);
    //        return;
    //    }

        instagramHandlers.getHashTagMedia(function(error, data) {
            if (error) {
                logger.log([error], __filename, true);
                return;
            }

            console.log(data);
        });
    //});
};
