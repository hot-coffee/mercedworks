
angular.module('MercedWorks').controller(
    'profileController', [
        '$scope',
        '$routeParams',
        'profileFactory',
        function($scope, $routeParams, profileFactory) {
            var currentPageIndex = 0;
            $scope.tabPressed = function(value) {
                if (value === currentPageIndex) {
                    return;
                }

                currentPageIndex = value;
                $scope.text = $scope.profile.interviews[currentPageIndex];
                $scope.picUrl = $scope.profile.pics[currentPageIndex];
            };

            var init = function() {
                profileFactory.getProfiles(function(error) {
                    if (error) {
                        console.log('error fetching profiles in profileController:', error);
                        return;
                    }

                    $scope.profile = profileFactory.profileForId($routeParams.profileId);
                    $scope.text = $scope.profile.interviews[0];
                    $scope.picUrl = $scope.profile.pics[0];
                });
            };

            init();
        }
    ]
);
