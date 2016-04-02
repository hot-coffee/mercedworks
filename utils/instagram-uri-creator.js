'use strict';

var constructUri = require('./construct-uri');
var config = require('./config');


module.export = function(params) {
    return config.apiInfo.instagram.recentMediaPath + constructUri(params);
};
