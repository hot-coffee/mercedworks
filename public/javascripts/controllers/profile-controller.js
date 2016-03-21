
angular.module('MercedWorks').controller(
    'profileController', [
        '$scope',
        '$routeParams',
        'profileFactory',
        '_',
        function($scope, $routeParams, profileFactory, _) {
            // scope variables
            $scope.introTabClass = 'col-xs-4 day enabled_intro';
            $scope.workTabClass = 'col-xs-4 day enabled_work';
            $scope.plansTabClass = 'col-xs-4 day enabled_plans';
            $scope.introPicPath = 'images/icons/ingto.png';
            $scope.workPicPath = 'images/icons/work.png';
            $scope.plansPicPath = 'images/icons/plans.png';

            // internal variables
            var currentPageIndex = 0;

            //scope methods
            $scope.tabPressed = function(value) {
                if (value === currentPageIndex || !shouldShowInterview(value)) {
                    return;
                }

                currentPageIndex = value;
                $scope.text = $scope.profile.interviews[currentPageIndex].interview;
                $scope.picUrl = $scope.profile.pics[currentPageIndex];
                setUpTabs();
            };

            // internal methods
            var setUpTabs = function() {
                if (shouldShowInterview(0)) {
                    $scope.introTabClass = 'col-xs-4 day enabled_intro';
                    $scope.introPicPath = 'images/icons/intro.png';
                } else {
                    $scope.introTabClass = 'col-xs-4 day disabled';
                    $scope.introPicPath = 'images/icons/intro_disabled.png';
                }

                if (shouldShowInterview(1)) {
                    $scope.workTabClass = 'col-xs-4 day enabled_work';
                    $scope.workPicPath = 'images/icons/work.png';
                } else {
                    $scope.workTabClass = 'col-xs-4 day disabled';
                    $scope.workPicPath = 'images/icons/work_disabled.png';
                }

                if (shouldShowInterview(2)) {
                    $scope.plansTabClass = 'col-xs-4 day enabled_plans';
                    $scope.plansPicPath = 'images/icons/plans.png';
                } else {
                    $scope.plansTabClass = 'col-xs-4 day disabled';
                    $scope.plansPicPath = 'images/icons/plans_disabled.png';
                }
            };

            var shouldShowInterview = function(index) {
                var interviews = $scope.profile.interviews;
                if (interviews.length > index) {
                    var now = new Date().getTime();
                    var date = Date.parse(interviews[index].releaseDate);
                    return now > date;
                }

                return false;
            };

            profileFactory.getProfiles(function(error) {
                if (error) {
                    console.log('error fetching profiles in profileController:', error);
                    return;
                }

                $scope.profile = profileFactory.profileForId($routeParams.profileId);
                $scope.text = $scope.profile.interviews[0].interview;
                $scope.picUrl = $scope.profile.pics[0];

                setUpTabs();
            });
        }
    ]
);
