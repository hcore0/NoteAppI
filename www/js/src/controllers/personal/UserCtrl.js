/**
 * 个人
 */
angular.module('noteApp.controllers')
.controller('UserCtrl', function ($scope, $state, $http, $cordovaToast, $ionicHistory, $ionicActionSheet, $ionicLoading, UserService, HostService, RestUrls, MediaService) {
    $ionicLoading.show();
    $http.get(RestUrls.user)
    .success(function (data) {
        $scope.user = data;
    })
    .error(function () {
        $scope.user = {
            nickname: '加载失败'
        };
    })
    .finally(function () {
        $ionicLoading.hide();
    });

    $scope.showSheet = function () {
        $ionicActionSheet.show({
            titleText: '添加头像',
            buttons: [
                {text: '从相机'},
                {text: '从相册'}
            ],
            cancelText: '取消',
            buttonClicked: function(index) {
                switch (index) {
                    case 0:
                        MediaService.getPhotoFromCamera(RestUrls.upload,
                            function (result) {
                                $scope.user.thumbnail = result.url;
                            });
                        break;
                    case 1:
                        MediaService.getPhotoFromLib(RestUrls.upload,
                            function (result) {
                                $scope.user.thumbnail = result.url;
                            });
                        break;
                }
                return true;
            }
        });
    };

    $scope.save = function () {
        $http.put(RestUrls.user, $scope.user)
        .success(function (data, status) {
            if (status === 200) {
                $ionicHistory.goBack(-1);
            }
            $cordovaToast.show(data.msg, 'short', 'center');
        });
    };
});