angular.module('noteApp.directives')
    .directive('thumbBox', function ($timeout){
        // Runs during compile
        return {
            restrict: 'E',
            scope: {
                childNum: '@'
            },
            template: '<div class="clearfix" ng-transclude></div>',
            replace: true,
            transclude: true,
            controller: function($scope, $element, $attrs, $transclude) {
                var fns = []; //所有子元素提供的加载方法

                this.addToQueue = function (fn) {
                    fns.push(fn);

                    if (fn.isLast) {
                        //最后一个, 开始执行加载
                        //
                        //为了让过渡动画平滑, 延迟3秒开始加载
                        $timeout(function () {
                            execLoad(fns.shift());
                        }, 3000);
                    }
                };

                function execLoad (fn) {
                    fn(function () {
                        if (fns.length > 0) {
                            execLoad(fns.shift());
                        }
                    });
                }
            }
        };
    });