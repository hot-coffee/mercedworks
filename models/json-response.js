'use strict';


module.exports = function(res, error, payload) {
    var response = {};
    response.error = error;
    response.payload = {result: payload};

    res.send(JSON.stringify(response));
};
