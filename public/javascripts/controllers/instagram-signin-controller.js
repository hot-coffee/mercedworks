angular.module('MercedWorks').controller(
    'instagramSignInController', [
        '$scope',
        '$location',
        'instagramFactory',
        function($scope, $location, instagramFactory) {
            $scope.buttonPressed = instagramFactory.buttonPressed;
        }
    ]
);
