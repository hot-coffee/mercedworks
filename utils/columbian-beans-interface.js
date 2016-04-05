'use strict';

const config = require('./config');
const requestJson = require('request-json');


module.exports = function(url, collection, payload, callback) {
    var data = {
        database: config.columbianBeans.database,
        collection: collection
    };

    if (payload) {
        data.payload = payload
    }

    console.log('sending to:', url, 'data', data);
    const client = requestJson.createClient(config.columbianBeans.hostAndPort());
    client.post(url, data, function (error, res, data) {
        callback(error, data);
    });
};
