/**
 * 个人
 */
angular.module('noteApp.controllers')
.controller('PersonalCtrl', function ($scope, $state, $http, $cordovaToast, UserService, HostService, RestUrls) {

    var host = HostService.getHost();

    $http.get(RestUrls.user)
    .success(function (data) {
        $scope.user = data;
    })
    .error(function () {
        $scope.user = {
            nickname: '加载失败'
        };
    });

    //退出
    $scope.logout = function () {
        UserService.removeUser();
        $state.go('login');
        $cordovaToast.show('退出成功', 'short', 'center');
    };
});