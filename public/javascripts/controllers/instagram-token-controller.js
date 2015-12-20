angular.module('mercedWorks').controller(
    'instagramTokenController', [
        '$scope',
        '$location',
        '$routeParams',
        function($scope, $location, $routeParams) {
            console.log('in instagram token controller');
            $scope.tokenText = 'Getting the Token';
            console.log('route params:', $routeParams);
            $scope.testText = JSON.stringify($routeParams);
        }
    ]
);
