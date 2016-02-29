var crypto = require('crypto');

module.exports.hashName = function (firstName, lastName) {
    const name = firstName + lastName;
    return crypto.createHash('md5').update(name).digest('hex');
};
