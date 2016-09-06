/**
 * 语音播放
 */
angular.module('noteApp.directives')
    .directive('audioPlayer', function () {
        return {
            scope: {
                audioSrc: '@'
            },
            restrict: 'EA',
            template: '<div class="audio-area"><audio ng-src="{{audioSrc}}" controls></audio></div>',
            replace: true
        };
    });