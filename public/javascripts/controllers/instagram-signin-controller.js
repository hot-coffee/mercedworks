angular.module('mercedWorks').controller(
    'instagramSignInController', [
        '$scope',
        '$location',
        'instagramFactory',
        function($scope, $location, instagramFactory) {
            $scope.buttonPressed = instagramFactory.buttonPressed;
        }
    ]
);
