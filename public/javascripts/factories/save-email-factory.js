'use strict';

const _ = require('underscore');

module.exports = function($http) {
    return {
        saveEmail: function(email, callback) {
            var postData = JSON.stringify({
                email: email
            });

            $http.post('api/save-email', postData)
                .success(function(data) {
                    console.log('receiving data from saving email:', data);
                    callback(_.has(data, 'payload') ? data.payload : -1);
                })
                .error(function(error) {
                    console.log('Error saving email', 'error:', error);
                    callback(-1);
                });
        }
    };
};
