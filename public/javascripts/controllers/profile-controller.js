angular.module('MercedWorks').controller(
    'profileController', [
        '$scope',
        '$routeParams',
        'profileFactory',
        function($scope, $routeParams, profileFactory) {
            var init = function() {
                profileFactory.getProfiles(function(error) {
                    if (error) {
                        console.log('error fetching profiles in profileController:', error);
                        return;
                    }

                    $scope.profile = profileFactory.profileForId($routeParams.profileId);
                });
            };

            init();
        }
    ]
);
