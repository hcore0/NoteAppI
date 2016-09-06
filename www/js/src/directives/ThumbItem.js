angular.module('noteApp.directives')
    .directive('thumbItem', function(){
        // Runs during compile
        return {
            restrict: 'E',
            require: '^thumbBox',
            scope: {
                thumbSrc: '@',
                isLast: '='
            },
            template: '<div class="thumb-item"><img src="" alt=""></div>',
            replace: true,
            link: function($scope, $element, $attrs, controller) {
                var fn = function (cb) {
                    var $img = $element.find('img');
                    $img.attr('src', $scope.thumbSrc);
                    $img.one('load', function () {
                        cb();
                    });
                };

                fn.isLast = $scope.isLast;
                controller.addToQueue(fn);
            }
        };
    });