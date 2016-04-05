'use strict';

var constructUri = require('./construct-uri');
var config = require('./config');
var _ = require('underscore');


module.exports = function(options, params) {
    var path;
    if (_.has(options, 'pathType') &&
        _.has(options, 'tag') &&
        options.pathType === 'get-recent-hash-tags') {
        path = '/v1/tags/' + options.tag + '/media/recent';
    } else if (_.has(options, 'pathType') &&
                options.pathType === 'get-recent-self-media') {
        path = config.apiInfo.instagram.recentMediaPath;
    }

    return path ? path + constructUri(params) : null;
};
