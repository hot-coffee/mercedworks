angular.module('MercedWorks').controller(
    'instagramTokenController', [
        '$scope',
        '$location',
        '$routeParams',
        function($scope, $location, $routeParams) {
            $scope.tokenText = 'Getting the Token';
            $scope.testText = JSON.stringify($routeParams);
        }
    ]
);
