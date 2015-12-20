'use strict';

module.exports = {
    instagram: {
        host: 'http://localhost',
        path: '/save-token',
        port: process.env.CAPPUCCINO_BEAN_PORT || '3334',
        hostAndPort: function () {
            return this.host + ':' + this.port;
        },
        uri: function () {
            return this.hostAndPort() + this.path;
        }
    },
    columbianBeans: {
        host: 'http://localhost',
        path: '/all-records',
        port: process.env.COLUMBIAN_BEANS_PORT || '9042',
        hostAndPort: function () {
            return this.host + ':' + this.port;
        },
        uri: function () {
            return this.hostAndPort() + this.path;
        }
    }
};
