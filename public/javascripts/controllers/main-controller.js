
angular.module('MercedWorks').controller(
    'mainController', [
        '$scope',
        '$location',
        '$anchorScroll',
        'profileFactory',
        function($scope, $location, $anchorScroll, profileFactory) {

            $scope.scrollToProfiles = function() {
                $location.hash('pic_container');
                $anchorScroll();
            };

            profileFactory.getProfiles(function(error) {
                if (error) {
                    // TODO UI to handle error
                    console.log('error fetching pics in main controller', error);
                    return;
                }

                $scope.profiles = profileFactory.profiles;
            });
        }
    ]
);
