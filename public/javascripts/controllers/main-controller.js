angular.module('mercedWorks').controller(
    'mainController', [
        '$scope',
        'profileFactory',
        function($scope, photoFactory) {
            photoFactory.getProfiles(function(error) {
                if (error) {
                    // TODO UI to handle error
                    console.log('error fetching pics in main controller', error);
                    return;
                }

                console.log('fetched profiles:', photoFactory.profiles);
                $scope.profiles = photoFactory.profiles;
            });
        }
    ]
);
