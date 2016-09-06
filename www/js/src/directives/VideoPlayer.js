/**
 * 视频播放
 */
angular.module('noteApp.directives')
    .directive('videoPlayer', function () {
        return {
            scope: {
                videoSrc: '@'
            },
            restrict: 'EA',
            template: '<div class="video-area" ng-click="play()"><video ng-src="{{videoSrc}}" height="100" autoplay></video></div>',
            replace: true,
            link: function($scope, $element, iAttrs, controller) {
                var video = $element.find('video')[0];
                $scope.play = function () {
                    video.webkitRequestFullScreen();
                    video.play();
                };
            }
        };
    });