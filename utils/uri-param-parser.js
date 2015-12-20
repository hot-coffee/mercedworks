'use strict';

module.exports = function(uri) {
    if (!uri || uri.length === 0) {
        return {};
    }

    var index = uri.indexOf('?');
    if (index === -1) {
        return {};
    }

    var params = {};
    var paramsString = uri.substring(index);
    index = paramsString.indexOf('=');
    while (index !== -1) {
        var key = paramsString.substring(1, index);
        paramsString = paramsString.substring(index + 1);
        var nextEntryIndex = paramsString.indexOf('&');
        var value;
        if (nextEntryIndex === -1) {
            value = paramsString;
        } else {
            value = paramsString.substring(0, nextEntryIndex);
            paramsString = paramsString.substring(nextEntryIndex);
        }

        params[key] = value;
        index = paramsString.indexOf('=');
    }

    return params;
};
