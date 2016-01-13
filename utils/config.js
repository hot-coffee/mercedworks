'use strict';

var path = require('path');
var logger = require('gruew-logger');

// TODO all params that can be moved to process.env should be moved

var port = process.env.MERCED_WORKS_PORT || '3333';
var appName = 'MercedWorks';
var mode = !!process.env['MERCED_WORKS_MODE'] ? process.env['MERCED_WORKS_MODE'] : 'production';

logger.log([appName, 'is in', mode, 'mode'], __filename, false);

var redirectUri,
    columbianBeanHost,
    columbianBeanPort,
    customClientScripts;

if (mode === 'production') {
    redirectUri = 'http://ec2-54-200-241-144.us-west-2.compute.amazonaws.com/got-instagram-token';
    columbianBeanHost = 'http://ec2-54-201-78-188.us-west-2.compute.amazonaws.com';
    columbianBeanPort = '80';
    customClientScripts = [
        'javascripts/vendor/google-analytics.js'
    ];
} else {
    redirectUri = 'http://localhost:3333/got-instagram-token';
    columbianBeanHost = 'http://localhost';
    columbianBeanPort = '9042';
    customClientScripts = [];
}

module.exports = {
    appName: appName,
    port: port,
    filePaths: {
        logFilePath: path.join('/var/log', appName),
        instagramParamsPath: path.join(__dirname, '../files/instagram-params.json'),
        instagramProfileMapPath: path.join(__dirname, '../files/instagram-profile-map.json')
    },
    columbianBeans: {
        database: appName.toLowerCase(),
        host: columbianBeanHost,
        port: columbianBeanPort,
        postPath: 'save-records/',
        getPath: 'all-records/',
        collections: {
            profiles: 'profiles',
            parameters: 'parameters'
        },
        hostAndPort: function () {
            return this.host + ':' + this.port;
        },
        getUri: function () {
            return this.hostAndPort() + '/' + this.getPath;
        },
        postUri: function () {
            return this.hostAndPort() + '/' + this.postPath;
        }
    },
    apiInfo: {
        instagram: {
            clientId: process.env.INSTAGRAM_CLIENT_ID || '4265370676f743eabb781e15f2228ed5',
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || 'f9cf460d3567413f81082a1af2f0aa8a',
            redirectUri: redirectUri,
            baseUri: 'api.instagram.com',
            accessTokenPath: '/oauth/access_token',
            recentMediaPath: '/v1/users/self/media/recent',
            port: 443
        }
    },
    client: {
        appName: appName,
        scripts: {
            angular: [
                'javascripts/app.js',
                'javascripts/controllers/main-controller.js',
                'javascripts/controllers/profile-controller.js',
                'javascripts/controllers/instagram-signin-controller.js',
                'javascripts/controllers/instagram-token-controller.js',
                'javascripts/factories/config-factory.js',
                'javascripts/factories/profile-factory.js',
                'javascripts/factories/instagram-factory.js'
            ],
            lib: [
                'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js',
                'https://code.angularjs.org/1.4.8/angular-route.min.js',
                'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-resource.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
            ],
            custom: customClientScripts
        },
        styleSheets: [
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
            'stylesheets/main.css',
            'stylesheets/animate.css'
        ]
    }
};