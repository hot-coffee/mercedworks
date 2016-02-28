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
            var emailShowing = true;

            $scope.showEmailField = function() {
                console.log('toggling email field:', emailShowing);
                $scope.shouldShowEmailField = emailShowing;
                emailShowing = !emailShowing;
            };

            $scope.emailButtonPressed = function () {
                console.log('saving email:', $scope.emailValue);
                if ($scope.emailValue.length > 0 && $scope.emailValue.indexOf('@') != -1) {
                    saveEmailFactory.saveEmail($scope.emailValue, function (success) {
                        if (success) {
                            $scope.emailValue = '';
                        }
                    });
                }
            };

            var picContainerElm = angular.element(document.getElementById('pic_container'));
            var offset = 0;
            var duration = 500;
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
