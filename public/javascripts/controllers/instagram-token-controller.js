angular.module('MercedWorks').controller(
    'instagramTokenController', [
        '$scope',
        '$location',
        '$routeParams',
        'configFactory',
        function($scope, $location, $routeParams, configFactory) {
            $scope.tokenText = 'Getting the Token';
            $scope.testText = JSON.stringify($routeParams);

            $scope.resourcePath = function(inputPath) {
                return configFactory.makePath(inputPath);
            };
        }
    ]
);
