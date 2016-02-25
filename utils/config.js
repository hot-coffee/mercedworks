'use strict';

var path = require('path');
var logger = require('gruew-logger');
var _ = require('underscore');


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
    redirectUri = 'http://ec2-54-213-18-188.us-west-2.compute.amazonaws.com/got-instagram-token';
    //redirectUri = 'http://10.0.1.4/got-instagram-token';
    columbianBeanHost = 'http://ec2-54-201-78-188.us-west-2.compute.amazonaws.com';
    //columbianBeanHost = 'http://10.0.1.3';
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
                'javascripts/factories/profile-factory.js',
                'javascripts/factories/instagram-factory.js'
            ],
            lib: [
                'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js',
                'https://code.angularjs.org/1.4.8/angular-route.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/angular-scroll/1.0.0/angular-scroll.min.js',
                'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-resource.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
            ],
            metaHeaders: [
                {
                    name: 'description',
                    content: 'Page description. No longer than 155 characters'
                },
                // twitter
                {
                    name: 'twitter:card',
                    content: 'summary'
                },
                {
                    name: 'twitter:site',
                    content: 'publisher_handle'
                },
                {
                    name: 'twitter:title',
                    content: 'Page Title'
                },
                {
                    name: 'twitter:description',
                    content: 'Page description less than 200 characters'
                },
                {
                    name: 'twitter:creator',
                    content: '@author_handle'
                },
                {
                    name: 'twitter:image',
                    content: 'http://www.example.com/image.jpg'
                },
                // facebook
                {
                    property: 'og:title',
                    content: 'Title Here'
                },
                {
                    property: 'og:type',
                    content: 'article'
                },
                {
                    property: 'og:url',
                    content: 'http://www.example.com/'
                },
                {
                    property: 'og:image',
                    content: 'http://example.com/image.jpg'
                },
                {
                    property: 'og:description',
                    content: 'Description Here'
                },
                {
                    property: 'og:og:site_name',
                    content: 'Site Name, i.e. Moz'
                },
                {
                    property: 'fb:admins',
                    content: 'Facebook numeric ID'
                }
            ],
            custom: customClientScripts
        },

        styleSheets: [
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
            'stylesheets/main.css',
            'stylesheets/animate.css'
        ],

        tagCreator: function (tagType, tagObject) {
            var tag = tagType + ' ';
            var keys = _.keys(tagObject);
            console.log('keys:', keys);
            var counter = 0;
            _.each(keys, function(key) {
                tag += key + '="' + tagObject[key] + '"' +
                    (counter === keys.length - 1 ? '' : ' ');
                counter++;
            });

            tag += ' /';
            return tag;
        }
    }
};