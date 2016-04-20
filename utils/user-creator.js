'use strict';

const config = require('./../utils/config');
const md5Hasher = require('./../utils/md5-hasher');
const jsonFile = require('jsonfile');
const path = require('path');
const _ = require('underscore');
const requestJson = require('request-json');
const logger = require('gruew-logger');


module.exports = function () {
    var usersFromFile = jsonFile.readFileSync(path.join(__dirname, '../files/profiles.json'));
    var users = [];
    _.each(usersFromFile, function (userFromFile) {
        userFromFile.picFolder = md5Hasher.hashName(
            userFromFile.firstName.toLowerCase(),
            userFromFile.lastName.toLowerCase()
        );

        userFromFile.dateCreated = Date.parse(userFromFile.dateCreated);;
        users.push(userFromFile);
    });

    const data = {
        database: config.columbianBeans.database,
        collection: config.columbianBeans.collections.profiles,
        payload: users
    };

    const client = requestJson.createClient(config.columbianBeans.hostAndPort());
    client.post(config.columbianBeans.postPath, data, function (err, res, data) {
        if (err) {
            logger.log(['Failed to retrieve entries from db:', err], __filename, true);
            return;
        }

        logger.log(['Posted to database. Response:', data], __filename, false);
    });
};
