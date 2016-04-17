'use strict';

require('angular');
require('angular-route');
require('angular-scroll');
require('angular-flippy');

var mainController = require('./controllers/main-controller');
var profileController = require('./controllers/profile-controller');
var instagramSignInController = require('./controllers/instagram-signin-controller');

var app = angular.module('MercedWorks', [
    'ngRoute',
    'duScroll',
    'angular-flippy'
]);

app.config(
    [
        '$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    controller: mainController,
                    templateUrl: 'partials/home'
                })
                .when('/profiles/:profileId', {
                    controller: profileController,
                    templateUrl: 'partials/profile'
                }).when('/instagram-sign-in', {
                    controller: instagramSignInController,
                    templateUrl: 'partials/instagram-sign-in'
                });
        }
    ]
);

app.controller('mainController', [
    '$scope',
    '$document',
    '$location',
    '$anchorScroll',
    'profileFactory',
    mainController
]);

app.controller('profileController', [
    '$scope',
    '$routeParams',
    'profileFactory',
    profileController
]);

app.controller('instagramSignInController', [
    '$scope',
    'instagramFactory',
    instagramSignInController
]);

app.factory('instagramFactory', ['$http', require('./factories/instagram-factory')]);
app.factory('profileFactory', ['$http', require('./factories/profile-factory')]);
