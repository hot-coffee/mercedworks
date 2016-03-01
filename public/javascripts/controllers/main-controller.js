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
            // scope variables
            $scope.shouldShowEmailField = false;
            $scope.emailValue = '';
            $scope.emailResultIconPath = '';
            $scope.emailResultMessage = '';
            $scope.shouldShowEmailResults = false;

            // local variables
            var emailShowing = true;
            var picContainerElm = angular.element(document.getElementById('pic_container'));
            var offset = 0;
            var duration = 500;

            // scope functions
            var setEmailResultValues = function(optionValue) {
                console.log('setting email result with value:', optionValue);
                var picPath = 'images/icons/';
                var message;
                var showResults = true;

                switch (optionValue) {
                    case 0:
                        // success case
                        picPath += 'email_confirm.png';
                        message = 'Email Sent!';
                        break;
                    case 1:
                        // email is invalid
                        picPath += 'email_decline.png';
                        message = 'Email Invalid';
                        break;
                    case 2:
                        // email already exists
                        picPath += 'email_decline.png';
                        message = 'Email Already Entered';
                        break;
                    case 3:
                        picPath += 'email_decline.png';
                        message = 'Something went wrong';
                        break;
                    case 4:
                        picPath += 'initial';
                        message = '';
                        showResults = false;
                        break;
                }

                if (showResults != $scope.shouldShowEmailResults) {
                    $scope.shouldShowEmailResults = true;
                }

                $scope.emailResultIconPath = picPath;
                $scope.emailResultMessage = message;
            };


            $scope.showEmailField = function () {
                $scope.shouldShowEmailField = emailShowing;

                if (!emailShowing) {
                    $scope.shouldShowEmailResults = false;
                    $scope.emailValue = '';
                }

                emailShowing = !emailShowing;
            };

            $scope.emailButtonPressed = function () {
                if ($scope.emailValue.length > 0 && $scope.emailValue.indexOf('@') != -1) {
                    saveEmailFactory.saveEmail($scope.emailValue, function (result) {
                        if (result === 0) {
                            $scope.emailValue = '';
                        }

                        setEmailResultValues(result);
                    });
                } else {
                    setEmailResultValues(1);
                }
            };


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
