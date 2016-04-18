'use strict';


module.exports = function($scope, $document, $location, $anchorScroll, profileFactory) {
    // public variables
    $scope.profiles = [];

    // public methods
    $scope.init = function() {
        profileFactory.getProfiles(function(error) {
            if (error) {
                // TODO UI to handle error
                console.log('error fetching pics in main controller', error);
                return;
            }

            debugger;
            $scope.profiles = profileFactory.profiles;
        });
    };

    $scope.scrollToProfiles = function() {
        $document.scrollToElementAnimated(picContainerElm, offset, duration);
    };

    $scope.getName = function(profile) {
        return profileFactory.nameForProfile(profile);
    };

    $scope.getProfileLink = function(profile) {
        return profileFactory.linkForProfile(profile);
    };

    $scope.mainPhotoClicked = function(profile) {
        debugger;
        console.log(profile);
    };

    $scope.isMercedWorksProfile = function(profile) {
        return profile.type === 'mercedworks';
    }
};
