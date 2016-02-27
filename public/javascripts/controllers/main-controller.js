'use strict';

angular.module('MercedWorks').controller(
    'mainController', [
        '$scope',
        '$document',
        '$location',
        '$anchorScroll',
        'profileFactory',
        'saveEmailFactory',
        function($scope, $document, $location, $anchorScroll, profileFactory, saveEmailFactory) {
            $scope.shouldShowEmailField = false;
            $scope.emailValue = '';

            $scope.showEmailField = function() {
                console.log('showing email field');
                $scope.shouldShowEmailField = true;
            };


            $scope.emailButtonPressed = function () {
                console.log('saving email:', $scope.emailValue);
                saveEmailFactory.saveEmail($scope.emailValue, function(success) {
                    if (success) {
                        $scope.emailValue = '';
                    }
                });
            };

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
