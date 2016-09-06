/**
 * 登陆
 */
angular.module('noteApp.controllers')
.controller('LoginCtrl', function ($scope, $state, $http, $ionicPopup, $ionicLoading, $cordovaToast, AuthService, UserService, HostService, RestUrls, Md5Service) {
    var authInfo = AuthService.getAuthInfo();

    //如果认证信息存在, 则自动填充表单
    if (!!authInfo) {
        $scope.formData = authInfo;
    } else {
        $scope.formData = {
            account: '',
            password: ''
        };
    }
    
    $scope.login = function () {
        if (!HostService.getHost()) {
            $cordovaToast.show('请先配置服务器地址', 'long', 'bottom');
            return;
        }
        $ionicLoading.show();
        $http.post(RestUrls.login, {
            account: $scope.formData.account,
            password: $scope.formData.password,
            // password: Md5Service.encrypt($scope.formData.password),
        })
        .success(function (data) {
            if (data) {
                //登陆成功 保存用户信息和账号密码
                UserService.setUser({
                    token: data.token
                });
                AuthService.setAuthInfo($scope.formData);

                //跳转首页
                $state.go('app.note');
            } else {
                $cordovaToast.show(data.msg, 'short', 'center');
            }
        })
        .error(function (err) {
            $cordovaToast.show(err || '请求超时', 'long', 'bottom');
        })
        .finally(function () {
            $ionicLoading.hide();
        });
    };

    //配置服务器地址
    $scope.configHost = function () {
        $ionicPopup.prompt({
            title: '配置',
            template: '请输入服务器地址',
            defaultText: HostService.getHost() || 'http://',
            cancelText: '取消',
            okText: '确定'
        }).then(function (addr) {
            if (!!addr) {
                HostService.setHost(addr);
                $cordovaToast.show('配置成功', 'short', 'center');
            }
        });
    };
});