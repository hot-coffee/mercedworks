
angular.module('MercedWorks').controller(
    'profileController', [
        '$scope',
        '$routeParams',
        'profileFactory',
        function($scope, $routeParams, profileFactory) {
            var init = function() {
                profileFactory.getProfiles(function(error) {
                    if (error) {
                        console.log('error fetching profiles in profileController:', error);
                        return;
                    }

                    $scope.profile = profileFactory.profileForId($routeParams.profileId);

                    var currentPage = 0;

                    $scope.updatePage = function(){
                        var interviewObject = $scope.profile.interview[currentPage];
                        var pic = interviewObject.pic;
                        var bio = interviewObject.bio;

                        
                    }

                    $scope.t0clicked= function(){
                        currentPage = 0; 
                        updatePage();
                    }

                    $scope.t1clicked = function(){
                        currentPage = 1;
                        updatePage();
                    }

                    $scope.t2clicked = function(){
                        currentPage = 2;
                        updatePage();
                    }

                });
            };

            init();
        }
    ]
);
