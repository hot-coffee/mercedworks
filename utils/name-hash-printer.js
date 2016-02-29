'use strict';

const md5hasher = require('./md5-hasher');
const jsonSender = require('./../models/json-sender');
const config = require('./config');
const _ = require('underscore');


module.exports = function() {
    const payload = {
        database: config.columbianBeans.database,
        collection: config.columbianBeans.collections.profiles
    };

    jsonSender(config.columbianBeans, 'get', payload, function (error, response) {
        if (error) {
            logger.log(
                ['Failed to fetch profiles from:', config.columbianBeans.host],
                __filename,
                true
            );
        }

        if (response && response.payload) {
            console.log('profile names and hashes');
            _.each(response.payload, function (profile) {
                const firstName = profile.firstName.toLowerCase();
                const lastName = profile.lastName.toLowerCase();
                console.log('Name:', firstName, ' ', lastName);
                console.log('Hash:', md5hasher.hashName(firstName, lastName))
            });
        }
    }.bind(this));
};