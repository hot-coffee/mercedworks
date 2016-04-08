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

            var mercedworksProfiles = [];
            var instagramProfiles = [];
            $scope.allProfiles = [];

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

                debugger;
                
                $scope.mercedworksProfiles = $scope.profiles.mercedWorks;
                $scope.instagramProfiles = $scope.profiles.socialMedia;

                $scope.allProfiles = mercedworksProfiles.concat(instagramProfiles);

            });
        }
    ]
);
