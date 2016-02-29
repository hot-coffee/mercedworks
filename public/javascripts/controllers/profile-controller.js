
angular.module('MercedWorks').controller(
    'profileController', [
        '$scope',
        '$routeParams',
        'profileFactory',
        function($scope, $routeParams, profileFactory) {


            var currentPageIndex = 0;

            var updateCurrentMedia = function() {
                $scope.text = $scope.profile.interviews[currentPageIndex];
                $scope.picUrl = $scope.profile.pics[currentPageIndex];
            };

            $scope.introPressed = function() {
                console.log('intro button pressed with page index:', currentPageIndex);
                if (currentPageIndex === 0) {
                    return;
                }

                currentPageIndex = 0;
                updateCurrentMedia();
            };

            $scope.workPressed = function() {
                console.log('work button pressed with page index:', currentPageIndex);
                if (currentPageIndex === 1 || $scope.profile.interviews.length < 2) {
                    return;
                }

                currentPageIndex = 1;
                updateCurrentMedia();
            };

            $scope.plansPressed = function() {
                console.log('plans button pressed with page index:', currentPageIndex);
                if (currentPageIndex === 2 || $scope.profile.interviews.length < 3) {
                    return;
                }

                currentPageIndex = 2;
                updateCurrentMedia();
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
