'use strict';

const _ = require('underscore');


module.exports = function(params) {
    var uri = '?';
    _.each(params, function(value, key) {
        uri += key + '=' + value + '&';
    });

    return uri.substring(0, uri.length - 1);
};
