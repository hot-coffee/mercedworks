console.log('loading app');
angular.module('underscore', []).factory('_', ['$window', function($window) {
    return $window._;
}]);

angular.module('MercedWorks', [
    'ngRoute',
    'underscore'
]);

angular.module('MercedWorks').config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    controller: 'mainController',
                    templateUrl: 'partials/home'
                }).when('/profiles/:profileId', {
                    controller: 'profileController',
                    templateUrl: 'partials/profile'
                }).when('/instagram-sign-in', {
                    controller: 'instagramSignInController',
                    templateUrl: 'partials/instagram-sign-in'
                });
        }
    ]
);
