angular.module('underscore', []).factory('_', ['$window', function($window) {
    return $window._;
}]);

var app = angular.module('mercedWorks', [
    'ngRoute',
    'ngAnimate',
    'underscore'
]);

app.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/',{
                    controller: 'mainController',
                    templateUrl: '../../views/homeview.html'
                }).when('/profiles/:profileId',{
                    controller: 'profileController',
                    templateUrl: '../../views/profileview.html'
                }).when('/update', {
                    controller: 'mainController',
                    templateUrl: '../../views/updateview.html'
                }).when('/instagram-sign-in', {
                    controller: 'instagramSignInController',
                    templateUrl: '../../views/instagram-signin.html'
                }).when('/got-instagram-token', {
                    controller: 'instagramTokenController',
                    templateUrl: '../../views/got-instagram-token.html'
                });
        }
    ]
);
