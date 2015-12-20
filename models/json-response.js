'use strict';


module.exports = function(res, error, payload) {
    res.send(JSON.stringify({
        error: error,
        payload: payload
    }));
};
