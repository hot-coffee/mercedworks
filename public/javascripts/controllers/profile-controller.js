
angular.module('MercedWorks').controller(
    'profileController', [
        '$scope',
        '$routeParams',
        'profileFactory',
        '_',
        function($scope, $routeParams, profileFactory, _) {
            var currentPageIndex = 0;

            $scope.introTabClass = 'col-xs-4 day enabled_intro';
            $scope.workTabClass = 'col-xs-4 day enabled_work';
            $scope.plansTabClass = 'col-xs-4 day enabled_plans';
            $scope.introPicPath = 'images/icons/people.png';
            $scope.workPicPath = 'images/icons/work.png';
            $scope.plansPicPath = 'images/icons/plans.png';

            $scope.tabPressed = function(value) {
                if (value === currentPageIndex) {
                    return;
                }

                currentPageIndex = value;
                $scope.text = $scope.profile.interviews[currentPageIndex];
                $scope.picUrl = $scope.profile.pics[currentPageIndex];
            };

            var setUpTabs = function() {
                $scope.introTabClass = $scope.profile.interviews.length >= 1 ?
                    'col-xs-4 day enabled_intro' : 'col-xs-4 day disabled';

                $scope.workTabClass = $scope.profile.interviews.length >= 2 ?
                    'col-xs-4 day enabled_work' : 'col-xs-4 day disabled';

                $scope.plansTabClass = $scope.profile.interviews.length >= 3 ?
                    'col-xs-4 day enabled_plans' : 'col-xs-4 day disabled';

                $scope.introPicPath = $scope.profile.interviews.length >= 1 ?
                    'images/icons/intro.png' : 'images/icons/intro_disabled.png';

                $scope.workPicPath = $scope.profile.interviews.length >= 2 ?
                    'images/icons/work.png' : 'images/icons/work_disabled.png';

                $scope.plansPicPath = $scope.profile.interviews.length >= 3 ?
                    'images/icons/plans.png' : 'images/icons/plans_disabled.png';
            };

            var init = function() {
                profileFactory.getProfiles(function(error) {
                    if (error) {
                        console.log('error fetching profiles in profileController:', error);
                        return;
                    }

                    $scope.profile = profileFactory.profileForId($routeParams.profileId);
                    $scope.text = $scope.profile.interviews[0];
                    $scope.picUrl = $scope.profile.pics[0];

                    setUpTabs();
                });
            };

            init();
        }
    ]
);
