angular.module('MercedWorks').controller(
    'profileController', [
        '$scope',
        '$routeParams',
        'profileFactory',
        'configFactory',
        function($scope, $routeParams, profileFactory, configFactory) {
            debugger;
            var init = function() {
                profileFactory.getProfiles(function(error) {
                    if (error) {
                        console.log('error fetching profiles in profileController:', error);
                        return;
                    }

                    $scope.profile = profileFactory.profileForId($routeParams.profileId);
                    $scope.resourcePath = function(inputPath) {
                        return configFactory.makePath(inputPath);
                    };
                });
            };

            init();
        }
    ]
);
