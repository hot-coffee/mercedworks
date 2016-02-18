
angular.module('MercedWorks').controller(
    'mainController', [
        '$scope',
        '$document',
        '$location',
        '$anchorScroll',
        'profileFactory',
        function($scope, $document, $location, $anchorScroll, profileFactory) {
            const picContainerElm = angular.element(document.getElementById('pic_container'));
            const offset = 0;
            const duration = 500;
            $scope.scrollToProfiles = function() {
                $document.scrollToElementAnimated(picContainerElm, offset, duration);
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
