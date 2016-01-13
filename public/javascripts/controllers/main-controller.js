angular.module('MercedWorks').controller(
    'mainController', [
        '$scope',
        'profileFactory',
        function($scope, profileFactory) {
            profileFactory.getProfiles(function(error) {
                if (error) {
                    // TODO UI to handle error
                    console.log('error fetching pics in main controller', error);
                    return;
                }

                console.log('fetched profiles:', profileFactory.profiles);
                $scope.profiles = profileFactory.profiles;
            });
        }
    ]
);
