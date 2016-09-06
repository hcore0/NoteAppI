//加载图片
angular.module('noteApp.directives')
    .directive('lazyImg', function(){
        // Runs during compile
        return {
            restrict: 'E',
            scope: {
                lazySrc: '@'
            },
            template: '<div class="lazy-img"><img ng-src="{{lazySrc}}" alt="" ng-show="loaded"><ion-spinner icon="spiral" ng-if="!loaded"></ion-spinner></div>',
            replace: true,
            link: function($scope, $element, $attrs, controller) {
                $scope.loaded = false;

                $element.find('img').one('load', function () {
                    $scope.loaded = true;
                });
            }
        };
    });